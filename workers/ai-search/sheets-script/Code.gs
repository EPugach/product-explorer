/**
 * NPSP AI Search Question Logger + Feedback
 *
 * Deploy as: Web app > Execute as: Me > Access: Anyone
 *
 * Setup:
 * 1. Create a Google Sheet with headers in Row 1:
 *    Query Hash | Timestamp | Question | IP Hash | Cached | Answer | Rating | Reason | Comment
 * 2. Open Extensions > Apps Script
 * 3. Paste this code into Code.gs
 * 4. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL into wrangler.toml SHEETS_LOG_URL
 *
 * Note: After updating this code, you must create a NEW deployment
 * (Deploy > New deployment) for changes to take effect.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (data.type === 'feedback') {
      // Merge feedback into existing question row by Query Hash (column A)
      var queryHash = data.queryHash || '';
      var found = false;
      if (queryHash) {
        var dataRange = sheet.getDataRange();
        var values = dataRange.getValues();
        for (var i = values.length - 1; i >= 1; i--) {
          if (values[i][0] === queryHash) {
            // Update Rating (G), Reason (H), Comment (I) on existing row
            sheet.getRange(i + 1, 7).setValue(data.rating || '');
            sheet.getRange(i + 1, 8).setValue((data.reason || '').substring(0, 100));
            sheet.getRange(i + 1, 9).setValue((data.comment || '').substring(0, 500));
            found = true;
            break;
          }
        }
      }
      if (!found) {
        // Fallback: append as new row if question row not found
        sheet.appendRow([
          queryHash,
          data.timestamp || new Date().toISOString(),
          data.question || '',
          data.ipHash || '',
          '',
          '',
          data.rating || '',
          (data.reason || '').substring(0, 100),
          (data.comment || '').substring(0, 500)
        ]);
      }
    } else {
      // Query log row: Query Hash, Timestamp, Question, IP Hash, Cached, Answer
      sheet.appendRow([
        data.queryHash || '',
        data.timestamp || new Date().toISOString(),
        data.question || '',
        data.ipHash || '',
        data.cached ? 'Yes' : 'No',
        data.answer || '',
        '',
        '',
        ''
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
