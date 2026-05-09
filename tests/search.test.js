import { describe, it, expect } from './test-utils.js';

const SYNONYMS = {
  tdtm: 'table driven trigger management',
  gau: 'general accounting unit',
  rd: 'recurring donation',
  rd2: 'enhanced recurring donation',
  lwc: 'lightning web component'
};

function expandSynonyms(text) {
  const lower = text.toLowerCase();
  const expansions = [];
  for (const [abbr, full] of Object.entries(SYNONYMS)) {
    if (lower.includes(abbr)) expansions.push(full);
  }
  return expansions.join(' ');
}

describe('expandSynonyms', () => {
  it('expands TDTM abbreviation', () => {
    const result = expandSynonyms('tdtm handler');
    expect(result.includes('table driven trigger management')).toBe(true);
  });
  it('expands LWC abbreviation', () => {
    const result = expandSynonyms('lwc components');
    expect(result.includes('lightning web component')).toBe(true);
  });
  it('returns empty for no matches', () => {
    expect(expandSynonyms('hello world')).toBe('');
  });
  it('is case-insensitive', () => {
    const result = expandSynonyms('TDTM');
    expect(result.includes('table driven trigger management')).toBe(true);
  });
  it('expands multiple synonyms in one query', () => {
    const result = expandSynonyms('tdtm and lwc');
    expect(result.includes('table driven trigger management')).toBe(true);
    expect(result.includes('lightning web component')).toBe(true);
  });
  it('rd2 expands to enhanced recurring donation', () => {
    const result = expandSynonyms('rd2 settings');
    expect(result.includes('enhanced recurring donation')).toBe(true);
  });
});
