import { describe, it, expect } from './test-utils.js';

function matchesByPrefix(className, tags) {
  if (!tags) return false;
  const classPrefix = className.split('_')[0] + '_';
  return tags.some((t) => t.startsWith(classPrefix));
}

function commonPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a.slice(0, i);
}

describe('matchesByPrefix', () => {
  it('matches class with matching tag prefix', () => {
    expect(matchesByPrefix('CRLP_RollupDonation', ['CRLP_Rollup', 'other'])).toBe(true);
  });
  it('does not match unrelated prefix', () => {
    expect(matchesByPrefix('BDI_DataImport', ['CRLP_Rollup', 'UTIL_Currency'])).toBe(false);
  });
  it('returns false for null tags', () => {
    expect(matchesByPrefix('Any_Class', null)).toBe(false);
  });
  it('returns false for empty tags', () => {
    expect(matchesByPrefix('Any_Class', [])).toBe(false);
  });
  it('matches when class prefix equals a tag exactly', () => {
    expect(matchesByPrefix('BDI_Processor', ['BDI_Processor', 'BDI_Helper'])).toBe(true);
  });
});

describe('commonPrefix', () => {
  it('finds shared prefix between LWC names', () => {
    expect(commonPrefix('geFormRenderer', 'geFormField')).toBe('geForm');
  });
  it('returns empty for no shared prefix', () => {
    expect(commonPrefix('abc', 'xyz')).toBe('');
  });
  it('handles identical strings', () => {
    expect(commonPrefix('same', 'same')).toBe('same');
  });
  it('handles one string being prefix of other', () => {
    expect(commonPrefix('ab', 'abc')).toBe('ab');
  });
  it('handles empty strings', () => {
    expect(commonPrefix('', 'abc')).toBe('');
  });
});
