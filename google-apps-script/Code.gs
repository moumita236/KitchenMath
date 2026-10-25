/**
 * KitchenMath → Google Sheets
 * Paste this into Extensions → Apps Script in your Google Sheet, set SECRET,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * Full steps: SETUP.md
 */

// Must match GOOGLE_SHEETS_SECRET in your website's environment variables.
const SECRET = "change-me-to-a-long-random-string";

const SHEETS = {
  enquiry: {
    name: "Enquiries",
    columns: [
      ["submittedAt", "Submitted at (IST)"],
      ["name", "Name"],
      ["restaurant", "Restaurant"],
      ["phone", "Phone / WhatsApp"],
      ["email", "Email"],
      ["city", "City"],
      ["platforms", "Sells on"],
      ["message", "What they want to improve"],
      ["page", "Page"],
      // Added for ad tracking. New columns always go at the END so existing rows stay aligned.
      ["source", "Source"],
      ["campaign", "Campaign"],
      ["adContent", "Ad / hook"],
      ["keyword", "Keyword"],
      ["landingPage", "Landing page"],
    ],
  },
  scorecard: {
    name: "Scorecard",
    columns: [
      ["submittedAt", "Submitted at (IST)"],
      ["name", "Name"],
      ["restaurant", "Restaurant"],
      ["phone", "Phone / WhatsApp"],
      ["email", "Email"],
      ["city", "City"],
      ["overallScore", "Overall score"],
      ["priorities", "Top priorities"],
      ["areaScores", "Area scores"],
      ["page", "Page"],
      // Added for ad tracking. New columns always go at the END so existing rows stay aligned.
      ["source", "Source"],
      ["campaign", "Campaign"],
      ["adContent", "Ad / hook"],
      ["keyword", "Keyword"],
      ["landingPage", "Landing page"],
    ],
  },
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (SECRET && data.secret !== SECRET) return json({ ok: false, error: "unauthorised" });

    const config = SHEETS[data.formType] || SHEETS.enquiry;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(config.name);
    if (!sheet) sheet = ss.insertSheet(config.name);

    // Write the header row on a new sheet, and fill in any missing column headings on an existing one.
    // Headings you typed yourself are never overwritten.
    const headers = sheet.getRange(1, 1, 1, config.columns.length);
    const current = headers.getValues()[0];
    if (current.some(function (h) { return h === ""; })) {
      headers.setValues([config.columns.map(function (c, i) { return current[i] === "" ? c[1] : current[i]; })]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // Prefix values starting with = + - @ so the sheet never treats them as formulas.
    sheet.appendRow(config.columns.map(function (c) {
      const v = data[c[0]] === undefined || data[c[0]] === null ? "" : data[c[0]];
      return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v;
    }));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the web-app URL in a browser to check it's live.
function doGet() {
  return json({ ok: true, message: "KitchenMath sheet webhook is running." });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
