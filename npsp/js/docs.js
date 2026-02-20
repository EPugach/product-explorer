// ══════════════════════════════════════════════════════════════
//  DOCS — Fetch, sanitize, render, and cache markdown documentation
//  Uses marked.js for parsing and DOMPurify for XSS prevention
// ══════════════════════════════════════════════════════════════

var docsCache = {};

// Resolve relative image paths in markdown to absolute paths
function resolveDocImagePaths(markdown, docPath) {
  // docPath example: "Configure_NPSP_Installation/Configure_Recurring_Donations.md"
  // Images reference: ![Image](images/page_251_img_1.png)
  // Need to resolve to: Documentation/Configure_NPSP_Installation/images/page_251_img_1.png
  var dir = docPath.substring(0, docPath.lastIndexOf('/'));
  return markdown.replace(
    /!\[([^\]]*)\]\(images\//g,
    '![$1](Documentation/' + dir + '/images/'
  );
}

// Fetch and render a single doc file, return sanitized HTML string
function fetchDoc(docPath) {
  if (docsCache[docPath]) return Promise.resolve(docsCache[docPath]);

  return fetch('Documentation/' + docPath)
    .then(function(resp) {
      if (!resp.ok) {
        console.warn('Doc not found:', docPath, resp.status);
        return null;
      }
      return resp.text();
    })
    .then(function(md) {
      if (!md) return null;
      md = resolveDocImagePaths(md, docPath);
      var rawHtml = marked.parse(md);
      // Sanitize HTML to prevent XSS
      var safeHtml = DOMPurify.sanitize(rawHtml, {
        ADD_TAGS: ['img'],
        ADD_ATTR: ['src', 'alt', 'title', 'class']
      });
      docsCache[docPath] = safeHtml;
      return safeHtml;
    })
    .catch(function(err) {
      console.warn('Failed to fetch doc:', docPath, err);
      return null;
    });
}

// Get all docs for a domain.component key, returns combined HTML or null
function getDocsForComponent(domainId, componentId) {
  var key = domainId + '.' + componentId;
  var paths = DOC_MAPPING[key];
  if (!paths || paths.length === 0) return Promise.resolve(null);

  return Promise.all(paths.map(fetchDoc)).then(function(results) {
    var valid = results.filter(Boolean);
    if (valid.length === 0) return null;
    return valid.join('<hr class="doc-separator">');
  });
}

// Render docs into a target element (called after core view is built)
function renderDocsSection(domainId, componentId, targetEl) {
  getDocsForComponent(domainId, componentId).then(function(docsHtml) {
    if (!docsHtml) {
      targetEl.style.display = 'none';
      return;
    }
    targetEl.style.display = '';
    targetEl.querySelector('.doc-body').textContent = '';
    // Safe: HTML has been sanitized by DOMPurify
    targetEl.querySelector('.doc-body').innerHTML = docsHtml;
  });
}
