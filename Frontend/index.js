
  function toggleBloodGroupField() {
    const select = document.getElementById("has-blood-bank");
    const field = document.getElementById("blood-group-field");
    if (select.value === "yes") {
      field.classList.remove("hidden");
    } else {
      field.classList.add("hidden");
    }
  }


function handleSubmit(e) {
    // code here
    e.preventDefault();
    console.log(e.target.name.value);
    console.log(e.target.email.value);
    console.log(e.target.password.value);

    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
    };

    console.log(formData);

    document.getElementById("show").innerText = formData.name;
};

function toggleDateField() {
      const select = document.getElementById("blood-history");
      const dateField = document.getElementById("date-field");
      if (select.value === "yes") {
        dateField.classList.remove("hidden");
      } else {
        dateField.classList.add("hidden");
      }
    }

    const publicData = [
  {id: "BR-001", patient: "Maria Ahmed", blood: "O+", units: 2, by: "Public", status: "Pending"},
  {id: "BR-002", patient: "Aziz Rahman", blood: "A-", units: 1, by: "Public", status: "Accepted"},
  {id: "BR-003", patient: "Fatema Ali", blood: "B+", units: 3, by: "Public", status: "Declined"},
  // Add as many mock/data objects as you like for demo
  {id: "BR-004", patient: "Khalid Khan", blood: "AB+", units: 2, by: "Public", status: "Pending"},
  {id: "BR-005", patient: "Samia Chowdhury", blood: "O-", units: 2, by: "Public", status: "Pending"},
  {id: "BR-006", patient: "Joyti Ghosh", blood: "A+", units: 1, by: "Public", status: "Accepted"},
  {id: "BR-007", patient: "Rashid Munna", blood: "B-", units: 4, by: "Public", status: "Declined"},
  {id: "BR-008", patient: "Lamia Tabassum", blood: "AB-", units: 3, by: "Public", status: "Accepted"},
  {id: "BR-009", patient: "Mehedi Hasan", blood: "O+", units: 5, by: "Public", status: "Pending"},
  {id: "BR-010", patient: "Sami Haque", blood: "A-", units: 2, by: "Public", status: "Accepted"},
];

let publicCurrentPage = 1, publicEntriesPerPage = 5, publicSearch = '';

function renderPublicTable() {
  const searchVal = publicSearch.toLowerCase();
  let filtered = publicData.filter(r =>
    r.id.toLowerCase().includes(searchVal) ||
    r.patient.toLowerCase().includes(searchVal) ||
    r.blood.toLowerCase().includes(searchVal) ||
    r.by.toLowerCase().includes(searchVal) ||
    r.status.toLowerCase().includes(searchVal)
  );
  const totalRows = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / publicEntriesPerPage));
  publicCurrentPage = Math.max(1, Math.min(publicCurrentPage, totalPages));
  const start = (publicCurrentPage - 1) * publicEntriesPerPage;
  const visible = filtered.slice(start, start + publicEntriesPerPage);

  document.getElementById('publicTableBody').innerHTML = visible.map(r => `
    <tr class="border-b hover:bg-gray-50">
      <td class="py-3 px-4 font-semibold">${r.id}</td>
      <td class="py-3 px-4">${r.patient}</td>
      <td class="py-3 px-4 font-extrabold text-red-600">${r.blood}</td>
      <td class="py-3 px-4">${r.units}</td>
      <td class="py-3 px-4">${r.by}</td>
      <td class="py-3 px-4">
        <span class="rounded-full px-3 py-1 text-xs font-semibold ${
          r.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
          r.status === "Accepted" ? "bg-green-100 text-green-700" :
          "bg-red-100 text-red-700"
        }">${r.status}</span>
      </td>
      <td class="py-3 px-4 flex gap-2">
        <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold">Accept</button>
        <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-bold">Decline</button>
      </td>
    </tr>
  `).join('');

  // Table Info
  document.getElementById('publicTableInfo').textContent =
    `Showing ${totalRows ? start + 1 : 0} to ${Math.min(start + publicEntriesPerPage, totalRows)} of ${totalRows} entries`;

  // Pagination
  let pageBtns = '';
  for (let i = 1; i <= totalPages; i++) {
    pageBtns += `<button onclick="gotoPublicPage(${i})"
      class="px-2 py-1 mx-0.5 rounded
        ${publicCurrentPage === i ? 'bg-[#FFD7D7] text-[#A83231] font-bold' : 'bg-gray-100 text-[#A83231] hover:bg-gray-200'}">
      ${i}</button>`;
  }
  document.getElementById('publicPagination').innerHTML =
    `<button onclick="prevPublicPage()" class="px-3 py-1 rounded-lg text-sm bg-[#006747] text-white hover:bg-[#178656] transition ${publicCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" ${publicCurrentPage === 1 ? 'disabled' : ''}>Prev</button>
     ${pageBtns}
     <button onclick="nextPublicPage()" class="px-3 py-1 rounded-lg text-sm bg-[#A83231] text-white hover:bg-[#942222] transition ${publicCurrentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" ${publicCurrentPage === totalPages ? 'disabled' : ''}>Next</button>`;
}

function prevPublicPage() { publicCurrentPage--; renderPublicTable(); }
function nextPublicPage() { publicCurrentPage++; renderPublicTable(); }
function gotoPublicPage(n) { publicCurrentPage = n; renderPublicTable(); }
document.getElementById('entriesPublic').addEventListener('change', function(e) {
  publicEntriesPerPage = +this.value; publicCurrentPage = 1; renderPublicTable();
});
document.getElementById('searchPublic').addEventListener('input', function(e) {
  publicSearch = this.value; publicCurrentPage = 1; renderPublicTable();
});
renderPublicTable();

function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    const isHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !isHidden);
  }
  // Click outside to close dropdown
  window.addEventListener('click', (e) => {
    const button = document.getElementById('requestsButton');
    const menu = document.getElementById('dropdownMenu');
    if (!button.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });

const hospitalData = [
  {id: "HR-001", hospital: "City Hospital", blood: "B+", units: 5, by: "Dr. Karim", status: "Pending"},
  {id: "HR-002", hospital: "General Hospital", blood: "O-", units: 3, by: "Dr. Hassan", status: "Accepted"},
  {id: "HR-003", hospital: "Memorial Clinic", blood: "A+", units: 7, by: "Dr. Fatima", status: "Declined"},
  {id: "HR-004", hospital: "Community Care", blood: "AB-", units: 4, by: "Dr. Reza", status: "Pending"},
  {id: "HR-005", hospital: "St. Mary's", blood: "B-", units: 2, by: "Dr. Jamal", status: "Accepted"},
  {id: "HR-006", hospital: "County Hospital", blood: "O+", units: 6, by: "Dr. Nadia", status: "Pending"},
  {id: "HR-007", hospital: "City Clinic", blood: "A-", units: 3, by: "Dr. Sami", status: "Declined"},
  {id: "HR-008", hospital: "Health Center", blood: "AB+", units: 5, by: "Dr. Liaqat", status: "Accepted"},
  {id: "HR-009", hospital: "Eastside Hospital", blood: "O-", units: 1, by: "Dr. Naeem", status: "Pending"},
  {id: "HR-010", hospital: "West End Clinic", blood: "B+", units: 8, by: "Dr. Samina", status: "Accepted"},
];

let hospitalCurrentPage = 1, hospitalEntriesPerPage = 5, hospitalSearch = '';

function renderHospitalTable() {
  const searchVal = hospitalSearch.toLowerCase();
  let filtered = hospitalData.filter(r =>
    r.id.toLowerCase().includes(searchVal) ||
    r.hospital.toLowerCase().includes(searchVal) ||
    r.blood.toLowerCase().includes(searchVal) ||
    r.by.toLowerCase().includes(searchVal) ||
    r.status.toLowerCase().includes(searchVal)
  );
  const totalRows = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / hospitalEntriesPerPage));
  hospitalCurrentPage = Math.max(1, Math.min(hospitalCurrentPage, totalPages));
  const start = (hospitalCurrentPage - 1) * hospitalEntriesPerPage;
  const visible = filtered.slice(start, start + hospitalEntriesPerPage);

  document.getElementById('hospitalTableBody').innerHTML = visible.map(r => `
    <tr class="border-b hover:bg-gray-50">
      <td class="py-3 px-4 font-semibold">${r.id}</td>
      <td class="py-3 px-4">${r.hospital}</td>
      <td class="py-3 px-4 font-extrabold text-red-600">${r.blood}</td>
      <td class="py-3 px-4">${r.units}</td>
      <td class="py-3 px-4">${r.by}</td>
      <td class="py-3 px-4">
        <span class="rounded-full px-3 py-1 text-xs font-semibold ${
          r.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
          r.status === 'Accepted' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }">${r.status}</span>
      </td>
      <td class="py-3 px-4 flex gap-2">
        <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold">Accept</button>
        <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-bold">Decline</button>
      </td>
    </tr>
  `).join('');

  // Table Info
  document.getElementById('hospitalTableInfo').textContent =
    `Showing ${totalRows ? start + 1 : 0} to ${Math.min(start + hospitalEntriesPerPage, totalRows)} of ${totalRows} entries`;

  // Pagination buttons
  let pageBtns = '';
  for(let i = 1; i <= totalPages; i++) {
    pageBtns += `<button onclick="gotoHospitalPage(${i})" class="px-2 py-1 mx-0.5 rounded ${
        hospitalCurrentPage === i ? 'bg-[#FFD7D7] text-[#A83231] font-bold' : 'bg-gray-100 text-[#A83231] hover:bg-gray-200'
      }">${i}</button>`;
  }
  document.getElementById('hospitalPagination').innerHTML = `
    <button onclick="prevHospitalPage()" class="px-3 py-1 rounded-lg text-sm bg-[#006747] text-white hover:bg-[#178656] transition ${hospitalCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" ${hospitalCurrentPage === 1 ? 'disabled' : ''}>Prev</button>
    ${pageBtns}
    <button onclick="nextHospitalPage()" class="px-3 py-1 rounded-lg text-sm bg-[#A83231] text-white hover:bg-[#942222] transition ${hospitalCurrentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" ${hospitalCurrentPage === totalPages ? 'disabled' : ''}>Next</button>`;

}

function prevHospitalPage() { hospitalCurrentPage--; renderHospitalTable(); }
function nextHospitalPage() { hospitalCurrentPage++; renderHospitalTable(); }
function gotoHospitalPage(n) { hospitalCurrentPage = n; renderHospitalTable(); }

document.getElementById('entriesHospital').addEventListener('change', function(e){
  hospitalEntriesPerPage = +this.value; hospitalCurrentPage = 1; renderHospitalTable();
});
document.getElementById('searchHospital').addEventListener('input', function(e){
  hospitalSearch = this.value; hospitalCurrentPage = 1; renderHospitalTable();
});

renderHospitalTable();

const trackData = [
  {id: "D-010", blood: "O+", units: 1, center: "Central Blood Bank", status: "Pending", completion: "16 Nov 2025"},
  {id: "D-011", blood: "A-", units: 2, center: "City Hospital", status: "In Process", completion: "18 Nov 2025"},
  {id: "D-012", blood: "B+", units: 1, center: "Community Blood Center", status: "Completed", completion: "Completed"},
  // Add more entries as needed
];

let trackCurrentPage = 1, trackEntriesPerPage = 5, trackSearch = '';

function renderTrackTable() {
  const searchVal = trackSearch.toLowerCase();
  let filtered = trackData.filter(r =>
    r.id.toLowerCase().includes(searchVal) ||
    r.blood.toLowerCase().includes(searchVal) ||
    r.center.toLowerCase().includes(searchVal) ||
    r.status.toLowerCase().includes(searchVal) ||
    r.completion.toLowerCase().includes(searchVal)
  );
  const totalRows = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / trackEntriesPerPage));
  trackCurrentPage = Math.max(1, Math.min(trackCurrentPage, totalPages));
  const start = (trackCurrentPage - 1) * trackEntriesPerPage;
  const visible = filtered.slice(start, start + trackEntriesPerPage);

  const tbodyRows = visible.map(r => `
    <tr class="border-b hover:bg-gray-50">
      <td class="py-3 px-6 font-semibold">${r.id}</td>
      <td class="py-3 px-6 font-extrabold text-red-600">${r.blood}</td>
      <td class="py-3 px-6">${r.units}</td>
      <td class="py-3 px-6">${r.center}</td>
      <td class="py-3 px-6">
        <span class="rounded-full px-3 py-1 text-xs font-semibold ${
          r.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
          r.status === "In Process" ? "bg-blue-100 text-blue-700" :
          "bg-green-100 text-green-700"
        }">${r.status}</span>
      </td>
      <td class="py-3 px-6">${r.completion}</td>
    </tr>
  `).join('');
  document.getElementById('trackTableBody').innerHTML = tbodyRows;

  document.getElementById('trackTableInfo').textContent =
    `Showing ${totalRows ? start + 1 : 0} to ${Math.min(start + trackEntriesPerPage, totalRows)} of ${totalRows} entries`;

  // Pagination buttons
  let pageBtns = '';
  for (let i = 1; i <= totalPages; i++) {
    pageBtns += `<button onclick="gotoTrackPage(${i})" class="px-2 py-1 mx-0.5 rounded cursor-pointer ${
      trackCurrentPage === i ? 'bg-green-200 text-green-800 font-bold' : 'bg-gray-100 text-green-700 hover:bg-gray-200'
    }">${i}</button>`;
  }

  document.getElementById('trackPagination').innerHTML = `
    <button onclick="prevTrackPage()" class="px-3 py-1 rounded-lg text-sm bg-green-700 text-white hover:bg-green-600 transition ${trackCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" ${trackCurrentPage === 1 ? 'disabled' : ''}>Prev</button>
    ${pageBtns}
    <button onclick="nextTrackPage()" class="px-3 py-1 rounded-lg text-sm bg-green-700 text-white hover:bg-green-600 transition ${trackCurrentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" ${trackCurrentPage === totalPages ? 'disabled' : ''}>Next</button>`;

}

function prevTrackPage(){ trackCurrentPage--; renderTrackTable(); }
function nextTrackPage(){ trackCurrentPage++; renderTrackTable(); }
function gotoTrackPage(n){ trackCurrentPage = n; renderTrackTable(); }

document.getElementById('entriesTrack').addEventListener('change', e => {
  trackEntriesPerPage = +e.target.value; trackCurrentPage = 1; renderTrackTable();
});

document.getElementById('searchTrack').addEventListener('input', e => {
  trackSearch = e.target.value; trackCurrentPage = 1; renderTrackTable();
});

function refreshStatus(){
  // implement refresh call or logic here if needed
  alert('Status refreshed!');
}

renderTrackTable();