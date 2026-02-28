/**
 * NPSP AI Search Question Logger
 *
 * Deploy as: Web app > Execute as: Me > Access: Anyone
 *
 * Setup:
 * 1. Create a Google Sheet with headers in Row 1:
 *    Timestamp | Question | IP Hash | Cached | Answer Preview
 * 2. Open Extensions > Apps Script
 * 3. Paste this code into Code.gs
 * 4. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL into wrangler.toml SHEETS_LOG_URL
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.question || '',
      data.ipHash || '',
      data.cached ? 'Yes' : 'No',
      (data.answerPreview || '').substring(0, 200)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
