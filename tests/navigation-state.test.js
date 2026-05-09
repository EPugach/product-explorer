import { describe, it, expect } from './test-utils.js';

function parseHash(hash) {
  const path = hash.replace(/^#\/?/, '');
  if (!path) return { level: 'galaxy' };
  const segments = path.split('/');
  if (segments.length === 1) return { level: 'planet', domainId: segments[0] };
  if (segments.length === 2) return { level: 'core', domainId: segments[0], componentId: segments[1] };
  if (segments.length >= 4) {
    const [domainId, componentId, entityType, ...nameParts] = segments;
    return { level: 'entity', domainId, componentId, entityType, entityName: decodeURIComponent(nameParts.join('/')) };
  }
  return { level: 'galaxy' };
}

describe('parseHash', () => {
  it('parses empty hash as galaxy', () => {
    expect(parseHash('#/')).toEqual({ level: 'galaxy' });
  });
  it('parses bare hash as galaxy', () => {
    expect(parseHash('#')).toEqual({ level: 'galaxy' });
  });
  it('parses single segment as planet', () => {
    expect(parseHash('#/donations')).toEqual({ level: 'planet', domainId: 'donations' });
  });
  it('parses two segments as core', () => {
    expect(parseHash('#/donations/opportunity-management')).toEqual({
      level: 'core', domainId: 'donations', componentId: 'opportunity-management'
    });
  });
  it('parses four segments as entity', () => {
    const result = parseHash('#/donations/opportunity-management/classes/OPP_DonationService');
    expect(result.level).toBe('entity');
    expect(result.domainId).toBe('donations');
    expect(result.componentId).toBe('opportunity-management');
    expect(result.entityType).toBe('classes');
    expect(result.entityName).toBe('OPP_DonationService');
  });
  it('handles encoded entity names', () => {
    const result = parseHash('#/tdtm/framework/classes/UTIL_UnitTestData%2FTEST');
    expect(result.entityName).toBe('UTIL_UnitTestData/TEST');
  });
  it('parses hash without leading slash', () => {
    expect(parseHash('#donations')).toEqual({ level: 'planet', domainId: 'donations' });
  });
  it('falls back to galaxy for three segments', () => {
    expect(parseHash('#/a/b/c')).toEqual({ level: 'galaxy' });
  });
});
