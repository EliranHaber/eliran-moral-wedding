/**
 * Backend for the wedding site's song-request wall.
 * Deploy this as a Google Apps Script Web App bound to a Google Sheet —
 * see SETUP.md for the step-by-step deployment instructions.
 *
 * Sheet columns (tab "Songs"): Timestamp | Song | Artist | Link | Suggested By | Count
 *
 * Suggesting a song that's already on the sheet (matched by song+artist, or
 * by link when neither name is known) bumps its Count instead of adding a
 * duplicate row — that Count is the heart number guests see on the site.
 * A like click resubmits the same way with unlike=false; clicking again to
 * undo a like sends unlike=true, which decrements Count instead (floored
 * at 1, since a row only exists because someone suggested it at least once).
 *
 * The song+artist match is order-independent (both names sorted before
 * joining) because two links for the same track can get their title parsed
 * inconsistently - one as "song: X, artist: Y", another as "song: Y, artist:
 * X" - and those must still be recognized as the same song.
 */

function rowKeyOf(song, artist, link) {
  var parts = [song, artist]
    .map(function (v) { return (v || '').toString().trim().toLowerCase(); })
    .filter(function (v) { return v; })
    .sort();
  if (parts.length) return parts.join('|');
  return (link || '').toString().trim().toLowerCase();
}

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
    var isUnlike = params.unlike === 'true';
    var key = rowKeyOf(song, artist, link);

    var data = sheet.getDataRange().getValues();
    var matchedRow = -1;
    for (var i = 1; i < data.length; i++) {
      var rowKey = rowKeyOf(data[i][1], data[i][2], data[i][3]);
      if (key && rowKey === key) {
        matchedRow = i + 1; // 1-indexed sheet row
        break;
      }
    }

    if (matchedRow > -1) {
      var currentCount = sheet.getRange(matchedRow, 6).getValue() || 1;
      var newCount = isUnlike ? Math.max(1, currentCount - 1) : currentCount + 1;
      sheet.getRange(matchedRow, 6).setValue(newCount);
    } else if (!isUnlike) {
      sheet.appendRow([new Date(), song, artist, link, name, 1]);
    }
    // An unlike with no matching row is a no-op — nothing to undo.
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
