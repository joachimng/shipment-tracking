
const SHEET_NAME = "Sheet1";

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  return ContentService
           .createTextOutput(JSON.stringify(data))
           .setMimeType(ContentService.MimeType.JSON)
           .setHeader("Access-Control-Allow-Origin", "*");
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const body = JSON.parse(e.postData.contents);

  if (body.action === "delete") {
    const idToDelete = body.id;
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == idToDelete) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({status: "deleted"}))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    sheet.appendRow([
      body.id,
      body.date,
      body.awb,
      body.flightDate,
      body.collectionArranged,
      body.fmJob,
      body.consignee,
      body.address,
      body.qty,
      body.len,
      body.wid,
      body.ht,
      body.volCbm,
      body.volWgt,
      body.weight,
      body.chargeable,
      body.remarks
    ]);
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
