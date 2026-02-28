/**
 * NPSP AI Search Question Logger + Feedback
 *
 * Deploy as: Web app > Execute as: Me > Access: Anyone
 *
 * Setup:
 * 1. Create a Google Sheet with headers in Row 1:
 *    Timestamp | Question | IP Hash | Cached | Answer Preview | Rating | Reason | Comment
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
      // Feedback row: Timestamp, Question, IP Hash, (empty), (empty), Rating, Reason, Comment
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.question || '',
        data.ipHash || '',
        '',
        '',
        data.rating || '',
        (data.reason || '').substring(0, 100),
        (data.comment || '').substring(0, 500)
      ]);
    } else {
      // Query log row: Timestamp, Question, IP Hash, Cached, Answer Preview, (empty), (empty), (empty)
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.question || '',
        data.ipHash || '',
        data.cached ? 'Yes' : 'No',
        (data.answerPreview || '').substring(0, 200),
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
