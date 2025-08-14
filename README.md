
# Airfreight Tracker

This project allows live-syncing of shipments with a Google Sheet and auto-refreshes every 30 seconds.

## Features
- Submit shipments via web form
- Live table display from Google Sheets
- Auto-refresh every 30 seconds
- Delete shipments directly from the table
- Dates displayed in dd/mm/yy format

## Setup
1. Create a Google Sheet with columns: ID, Date, AWB, Flight Date, Collection, FM Job, Consignee, Address, Qty, L, W, H, Volume, Vol Weight, Weight, Chargeable, Remarks.
2. Deploy the Apps Script (`apps-script.gs`) as Web App with **Anyone, even anonymous** access.
3. Replace `YOUR_APPS_SCRIPT_DEPLOY_URL_HERE` in `index.html` with the Web App URL.
4. Open `index.html` in your browser.
