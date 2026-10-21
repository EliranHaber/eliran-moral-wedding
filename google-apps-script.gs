/**
 * Backend for the wedding site's song-request wall.
 * Deploy this as a Google Apps Script Web App bound to a Google Sheet —
 * see SETUP.md for the step-by-step deployment instructions.
 *
 * Sheet columns (tab "Songs"): Timestamp | Song | Artist | Link | Suggested By | Count
 *
 * Suggesting a song that's already on the sheet (matched by song name, or by
 * link when no song name is given) bumps its Count instead of adding a
 * duplicate row — that Count is the heart number guests see on the site.
 */

function doPost(e) {
  var params = e.parameter;
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (params.type === 'song') {
    var sheet = ss.getSheetByName('Songs') || ss.insertSheet('Songs');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Song', 'Artist', 'Link', 'Suggested By', 'Count']);
    }

    var song = (params.song || '').trim();
    var artist = (params.artist || '').trim();
    var link = (params.link || '').trim();
    var name = (params.name || '').trim();
    var key = (song || link).toLowerCase();

    var data = sheet.getDataRange().getValues();
    var matchedRow = -1;
    for (var i = 1; i < data.length; i++) {
      var rowKey = ((data[i][1] || data[i][3] || '') + '').trim().toLowerCase();
      if (key && rowKey === key) {
        matchedRow = i + 1; // 1-indexed sheet row
        break;
      }
    }

    if (matchedRow > -1) {
      var currentCount = sheet.getRange(matchedRow, 6).getValue();
      sheet.getRange(matchedRow, 6).setValue((currentCount || 1) + 1);
    } else {
      sheet.appendRow([new Date(), song, artist, link, name, 1]);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Songs');
  var rows = [];

  if (sheet && sheet.getLastRow() > 1) {
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      rows.push({
        song: data[i][1] || '',
        artist: data[i][2] || '',
        link: data[i][3] || '',
        name: data[i][4] || '',
        count: data[i][5] || 1
      });
    }
    rows.reverse(); // newest first
  }

  return ContentService
    .createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}
