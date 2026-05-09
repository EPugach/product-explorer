const suites = [];
let currentSuite = null;

export function describe(name, fn) {
  currentSuite = { name, tests: [], passed: 0, failed: 0 };
  suites.push(currentSuite);
  fn();
  currentSuite = null;
}

export function it(name, fn) {
  const test = { name, error: null };
  try {
    fn();
    test.passed = true;
    currentSuite.passed++;
  } catch (e) {
    test.passed = false;
    test.error = e.message;
    currentSuite.failed++;
  }
  currentSuite.tests.push(test);
}

export function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected))
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toContain(item) {
      if (!actual.includes(item)) throw new Error(`Expected array to contain ${JSON.stringify(item)}`);
    },
    toBeGreaterThan(n) {
      if (!(actual > n)) throw new Error(`Expected ${actual} > ${n}`);
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy, got ${JSON.stringify(actual)}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy, got ${JSON.stringify(actual)}`);
    },
    toHaveLength(n) {
      if (actual.length !== n) throw new Error(`Expected length ${n}, got ${actual.length}`);
    }
  };
}

export function reportAll(container) {
  let html = '';
  let totalPassed = 0, totalFailed = 0;
  for (const suite of suites) {
    html += `<div class="suite"><h2>${suite.name}</h2>`;
    for (const t of suite.tests) {
      const icon = t.passed ? '✓' : '✗';
      const cls = t.passed ? 'pass' : 'fail';
      html += `<div class="${cls}">${icon} ${t.name}</div>`;
      if (t.error) html += `<pre>${t.error}</pre>`;
    }
    html += `</div>`;
    totalPassed += suite.passed;
    totalFailed += suite.failed;
  }
  html = `<p><strong>${totalPassed} passed, ${totalFailed} failed</strong></p>` + html;
  container.innerHTML = html;
}
