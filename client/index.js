// event handler for when page loads
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json()) //convert response into json
    //.then(data => console.log(data)); //show json data on console
    //loadHTMLTable([]);
    .then(data => loadHTMLTable(data['data'])); //load html data into Table
});

document.querySelector('table tbody').addEventListener('click', function(event) {
    //console.log("In function(event)" + event.target)

    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function() {
    console.log("In searchBtn.onclick()");

    const searchValue = document.querySelector('#search-input').value;

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

function deleteRowById(id) {
    console.log("In deleteRowById()");

    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

function handleEditRow( id ) {
    console.log("In handleEditRow()" + id);

    const updateSection = document.querySelector('#update-row ');
    updateSection.hidden = false;
    document.querySelector('#update-row-btn').dataset.id = id;
} 

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');

    console.log("In updateBtn.onclick() ");
     
    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: document.querySelector('#update-row-btn').dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
}

const addBtn = document.querySelector('#add-name-btn');

// call back function
addBtn.onclick = function() {
    console.log("In addBtn.onclick()");

    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";
  
    //send to backend
    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name : name})     
    }) 
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data) {
    console.log("In - insertRowIntoTable()")

    const table = document.querySelector('table tbody');
    //does class noData exist
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
         
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                 data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn"   data-id=${data.id}>Edit</td>`;      

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else  {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }     
}

function loadHTMLTable(data) {
    console.log("in loadHTMLTable()");

    const table = document.querySelector('table tbody'); //grab table body

    if (data.length === 0) {
        //add table row
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";

    // callback fuction
    //retrieve all items from db 
    data.forEach(function ({id, name, date_added}) {
        //used when table is first loaded
        tableHtml += "<tr>";
        //use spring intipolation
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</td>";        
    });
    table.innerHTML = tableHtml;
} 