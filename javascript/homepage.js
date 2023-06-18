// aicia ii miezu
const formCreateTableHomepage = document.getElementById("createTableHomepage");

formCreateTableHomepage.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const tableNameValue = document.getElementById("tableName").value;
    const numOfColsValue = document.getElementById("numOfCols").value;

    const data = {
        tableName: tableNameValue,
        numberOfColumns: numOfColsValue
    }

    console.log("data " + data);

    fetch('/submitTableDataFromHomepage', {
        method: 'POST',
        headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded'
        'Content-Type': 'application/json',
        },
        // body: `data=${encodeURIComponent(data)}`
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        window.location.href = '/createTable';
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Reset the form
    formCreateTableHomepage.reset();
});








function contactUs() {
    //    window.open("aboutPage.html");
            window.location.href='/about';
   }

let jsonData;
var listaTabele = document.getElementById("listaTabele");

    fetch('/getTablesStructure')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        jsonData = data;

        for (var i = 1; i < data.tables.length; i++) {// i -> nume tabele
            var tabel = document.createElement("div");
            tabel.classList.add("tabel");

            var tabelDescription = document.createElement("div");
            tabelDescription.classList.add("table-description");
            
            var h2 = document.createElement("h2");
            h2.textContent = data.tables[i].name;
            
            tabelDescription.appendChild(h2);
            tabel.appendChild(tabelDescription);

            for (var j = 0; j < data.tables[i].columns.length; j++) {
                var row = document.createElement("div");
                row.classList.add("row");
                row.id = "row_" + data.tables[i].columns[j].name + i;
                row.innerHTML = "<div class=\"field-name-min\"><form class=\"form-control\"><label><input class=\"row-check\" type=\"checkbox\" value=\"\"></label></form><button class=\"expand-button\" onclick=\"toggleRowData(event)\">+</button><div class=\"row-title\">ID</div></div>";
                
                var rowData = document.createElement("div");
                rowData.classList.add("row-data");
                rowData.id = "rowData_" + data.tables[i].columns[j].name + i;


                var col1 = document.createElement("div");//name
                col1.classList.add("col");
                col1.id = "col_" + data.tables[i].columns[j].name + i;
                col1.innerHTML = "<p><b>NAME: </b> <i>" + data.tables[i].columns[j].name + "</i></p>";

                var col2 = document.createElement("div");//type
                col2.classList.add("col");
                col2.id = "col_" + data.tables[i].columns[j].name + i;
                col2.innerHTML = "<p><b>TYPE:</b> <i>" + data.tables[i].columns[j].type + "</i></p>";

                var col3 = document.createElement("div");//default value
                col3.classList.add("col");
                col3.id = "col_" + data.tables[i].columns[j].name + i;
                col3.innerHTML = "<p><b>DEFAULT:</b> <i>" + data.tables[i].columns[j].defaultValue + "</i></p>";

                var col4 = document.createElement("div");//default value
                col4.classList.add("col");
                col4.id = "col_" + data.tables[i].columns[j].name + i;
                col4.innerHTML = "<p><b>NOT NULL</b> <i>" + data.tables[i].columns[j].name + "</i></p>";

                var col5 = document.createElement("div");//default value
                col5.classList.add("col");
                col5.id = "col_" + data.tables[i].columns[j].name + i;
                col5.innerHTML = "<p><b>PRIMARY KEY:</b> <i>" + data.tables[i].columns[j].primaryKey + "</i>";

                var col6 = document.createElement("div");//default value
                col6.classList.add("col");
                col6.id = "col_" + data.tables[i].columns[j].name + i;
                col6.innerHTML = "<p><b>FOREIGN KEY:</b> <i>" + data.tables[i].columns[j].foreignKey + "</i></p>";

                var col7 = document.createElement("div");//default value
                col7.classList.add("col");
                col7.id = "col_" + data.tables[i].columns[j].name + i;
                col7.innerHTML = "<p><b>AUTO INDEX:</b> <i>" + data.tables[i].columns[j].autoIncrement + "</i></p>";

                
                rowData.appendChild(col1);
                rowData.appendChild(col2);
                rowData.appendChild(col3);
                rowData.appendChild(col4);
                rowData.appendChild(col5);
                rowData.appendChild(col6);
                rowData.appendChild(col7);
                
                row.appendChild(rowData);
                tabel.appendChild(row);
            }

            var form = document.createElement("form");
            form.id = data.tables[i].name;
            form.setAttribute('onsubmit', 'submitButtons(event); return false;');
            form.innerHTML = "<label><input class=\"row-check\" type=\"checkbox\" value=\"Check all\">Check all</label><div><input class=\"submit\" type=\"submit\" onclick=\"location.href='/homepage';\" value=\"Drop table\"><input class=\"submit\" type=\"button\"value=\"Alter table\"><input class=\"submit\" type=\"submit\" onclick=\"location.href='/viewTable';\" value=\"View table\"></div>";

            var tableCommands = document.createElement("div");
            tableCommands.id = data.tables[i].name;
            tableCommands.classList.add("table-commands");

            tableCommands.appendChild(form);

            tabel.appendChild(tableCommands);
            listaTabele.appendChild(tabel);
        }        
      })
      .catch(error => console.error(error));


      function submitButtons(event){
        event.preventDefault();
        
        if (event.submitter.value === "Drop table") {
            dropTable(event.target.id);
        } else if (event.submitter.value === "View table") {
            viewTable(event.target.id);
        }
      }

    //   drop table
    function dropTable(tableName){
        const data = {
            tableName: tableName
        }

        fetch('/deleteTable', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function viewTable(tableName){
        const data = {
            tableName: tableName
        }
        
        // fetch('/deleteTable', {
        fetch('/viewTABLE', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }



    // download json -> export
    function downloadFile() {
        // console.log(jsonData);
 
          var data = JSON.stringify(jsonData, null, 2);
    
          var blob = new Blob([data], { type: 'application/json' });
          var url = window.URL.createObjectURL(blob);
          var link = document.createElement('a');
          link.href = url;
          link.download = 'exportedDatabase.json';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
      }