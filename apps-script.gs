<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Airfreight Tracker</title>
<style>
body { font-family: Arial; margin: 20px; }
form { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
label { display: block; margin-top: 10px; }
input, textarea, select { width: 100%; padding: 5px; margin-top: 5px; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
th { background: #f0f0f0; }
.cargo-row { display: flex; gap: 10px; margin-top: 10px; }
.cargo-row input { width: 100px; }
button { padding: 5px 10px; margin-top: 10px; cursor: pointer; }
</style>
</head>
<body>

<h1>Airfreight Tracker</h1>

<form id="shipmentForm">
  <label>Date: <input type="date" name="date" required></label>
  <label>AWB: <input type="text" name="awb" required></label>
  <label>Flight Date: <input type="date" name="flightDate" required></label>
  <label>Collection Arranged:
    <select name="collectionArranged">
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </label>
  <label>FM Job Number: <input type="text" name="fmJob"></label>
  <label>Consignee: <input type="text" name="consignee"></label>
  <label>Address: <textarea name="address"></textarea></label>

  <h3>Cargo Details</h3>
  <div id="cargoContainer"></div>
  <button type="button" onclick="addCargoRow()">Add Cargo</button>

  <button type="submit">Submit Shipment</button>
</form>

<h2>All Shipments (auto-refresh every 30 sec)</h2>
<table id="shipmentsTable">
  <thead>
    <tr>
      <th>ID</th><th>Date</th><th>AWB</th><th>Flight Date</th><th>Collection</th>
      <th>FM Job</th><th>Consignee</th><th>Address</th><th>Qty</th>
      <th>L</th><th>W</th><th>H</th><th>Volume</th>
      <th>Vol Weight</th><th>Weight</th><th>Chargeable</th><th>Remarks</th><th>Delete</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

<script>
const API_URL = "https://script.google.com/macros/s/AKfycbzjPk8Pmj-Kx33QX-eFyxIxcKzH7XQk-K4_RkUf_9Bhw_lQ-13L1bh4SGrU07zK8Uw/exec";

function addCargoRow() {
  const div = document.createElement('div');
  div.className = 'cargo-row';
  div.innerHTML = `
    <input type="number" name="qty" placeholder="Qty" required>
    <input type="number" name="len" placeholder="L (cm)" required>
    <input type="number" name="wid" placeholder="W (cm)" required>
    <input type="number" name="ht" placeholder="H (cm)" required>
    <input type="number" name="weight" placeholder="Weight (kg)" required>
    <input type="text" name="remarks" placeholder="Remarks">
  `;
  document.getElementById('cargoContainer').appendChild(div);
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [y,m,d] = isoDate.split('-');
  return `${d}/${m}/${y.slice(2)}`;
}

document.getElementById('shipmentForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const formData = new FormData(this);
  const baseData = {
    id: Date.now(),
    date: formatDate(formData.get('date')),
    awb: formData.get('awb'),
    flightDate: formatDate(formData.get('flightDate')),
    collectionArranged: formData.get('collectionArranged'),
    fmJob: formData.get('fmJob'),
    consignee: formData.get('consignee'),
    address: formData.get('address')
  };

  const cargoRows = document.querySelectorAll('#cargoContainer .cargo-row');
  for (const row of cargoRows) {
    const qty = row.querySelector('input[name="qty"]').value;
    const len = row.querySelector('input[name="len"]').value;
    const wid = row.querySelector('input[name="wid"]').value;
    const ht = row.querySelector('input[name="ht"]').value;
    const weight = row.querySelector('input[name="weight"]').value;
    const remarks = row.querySelector('input[name="remarks"]').value;
    const volCbm = (qty*len*wid*ht)/1e6;
    const volWgt = (qty*len*wid*ht)/6000;
    const chargeable = Math.max(weight, volWgt);

    const rowData = {...baseData, qty,len,wid,ht,volCbm,volWgt,weight,chargeable,remarks};
    await fetch(API_URL, {method:"POST", body: JSON.stringify(rowData)});
  }

  alert("Shipment submitted!");
  this.reset();
  document.getElementById('cargoContainer').innerHTML='';
  addCargoRow();
  loadShipments();
});

async function loadShipments() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const tbody = document.querySelector('#shipmentsTable tbody');
    tbody.innerHTML='';

    data.slice(1).forEach(row => {
      if (!row || row.length === 0) return;
      const tr = document.createElement('tr');
      row.forEach((cell, idx) => {
        const td = document.createElement('td');
        if ((idx===1 || idx===3) && typeof cell === 'number') {
          const date = new Date((cell-25569)*86400000);
          td.textContent = `${("0"+date.getDate()).slice(-2)}/${("0"+(date.getMonth()+1)).slice(-2)}/${date.getFullYear().toString().slice(2)}`;
        } else td.textContent = cell || '';
        tr.appendChild(td);
      });
      const tdDel=document.createElement('td');
      const btn=document.createElement('button');
      btn.textContent="Delete";
      btn.onclick=async()=>{ 
        if(confirm("Delete this row?")) {
          await fetch(API_URL,{method:"POST",body: JSON.stringify({action:"delete",id:row[0]})});
          loadShipments();
        }
      };
      tdDel.appendChild(btn);
      tr.appendChild(tdDel);
      tbody.appendChild(tr);
    });
  } catch(err) { console.error(err); }
}

addCargoRow();
loadShipments();
setInterval(loadShipments, 30000);
</script>
</body>
</html>
