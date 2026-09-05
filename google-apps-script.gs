/**
 * Backend for the wedding site's song-request wall.
 * Deploy this as a Google Apps Script Web App bound to a Google Sheet —
 * see SETUP.md for the step-by-step deployment instructions.
 */

function doPost(e) {
  var params = e.parameter;
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (params.type === 'song') {
    var songSheet = ss.getSheetByName('Songs') || ss.insertSheet('Songs');
    if (songSheet.getLastRow() === 0) {
      songSheet.appendRow(['Timestamp', 'Song', 'Artist', 'Link', 'Suggested By']);
    }
    songSheet.appendRow([
      new Date(),
      params.song || '',
      params.artist || '',
      params.link || '',
      params.name || ''
    ]);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('This endpoint only accepts POST requests from the wedding site.');
}
