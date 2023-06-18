let createTableDataInitial = null;
let createTableData = null;
let columnsList = [];

fetch('/getTableDataFromHomepage')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        createTableDataInitial = data;

        let tableNameH3 = document.getElementById("tableNameH3");
        tableNameH3.innerHTML = "Table name: " + data.tableName;

        let allFields = document.getElementById("allFields");
        for (var i = 1; i <= data.numberOfColumns; i++) {
            var div = document.createElement("div");
            div.id = "fieldDiv" + i;
            div.classList.add("divFromForm");

            // input for column name
            var inputColumnName = document.createElement("input");
            inputColumnName.type = "text";
            inputColumnName.name = "table-name" + i;
            inputColumnName.id = "column" + i;
            inputColumnName.placeholder = "Column name";

            // select datatype
            var select = document.createElement("select");
            select.name = "selectTypeCol" + i;
            select.id = "selectTypeCol" + i;

            var option1 = document.createElement("option");
            option1.value = "VARCHAR";
            option1.text = "VARCHAR";

            var option2 = document.createElement("option");
            option2.value = "DATE";
            option2.text = "DATE";

            var option3 = document.createElement("option");
            option3.value = "INT";
            option3.text = "INT";

            var option4 = document.createElement("option");
            option4.value = "TEXT";
            option4.text = "TEXT";

            var option5 = document.createElement("option");
            option5.value = "NUMBER";
            option5.text = "NUMBER";

            // <input min="0" placeholder="Type length" type="number">
            var inputTypeLength = document.createElement("input");
            inputTypeLength.type = "number";
            inputTypeLength.name = "length" + i;
            inputTypeLength.id = "length" + i;
            inputTypeLength.placeholder = "Type length";
            inputTypeLength.min = 0;

            // <input placeholder="Default value" type="text">
            var inputDefaultValue = document.createElement("input");
            inputDefaultValue.type = "text";
            inputDefaultValue.name = "defaultValue" + i;
            inputDefaultValue.id = "defaultValue" + i;
            inputDefaultValue.placeholder = "Default value";

            // notNullBox
            var labelNotNullBox = document.createElement("label");

            var notNullBox = document.createElement("input");
            notNullBox.type = "checkbox";
            notNullBox.classList.add("row-check");
            notNullBox.name = "notNullBox" + i;
            notNullBox.id = "notNullBox" + i;

            labelNotNullBox.appendChild(notNullBox);
            var labelNotNullBoxText = document.createTextNode("NOT NULL");
            labelNotNullBox.appendChild(labelNotNullBoxText);

            // primaryKey
            var labelPrimaryKey = document.createElement("label");

            var inputPrimaryKey = document.createElement("input");
            inputPrimaryKey.type = "checkbox";
            inputPrimaryKey.classList.add("row-check");
            inputPrimaryKey.name = "primaryKey" + i;
            inputPrimaryKey.id = "primaryKey" + i;

            labelPrimaryKey.appendChild(inputPrimaryKey);
            var labelPrimaryKeyText = document.createTextNode("PRIMARY KEY");
            labelPrimaryKey.appendChild(labelPrimaryKeyText);

            // foreignKey
            var labelForeignKey = document.createElement("label");

            var inputForeignKey = document.createElement("input");
            inputForeignKey.type = "checkbox";
            inputForeignKey.classList.add("row-check");
            inputForeignKey.name = "foreignKey" + i;
            inputForeignKey.id = "foreignKey" + i;

            labelForeignKey.appendChild(inputForeignKey);
            var labelForeignKeyText = document.createTextNode("FOREIGN KEY");
            labelForeignKey.appendChild(labelForeignKeyText);

            // autoIndex
            var labelAutoIndex = document.createElement("label");

            var inputAutoIndex = document.createElement("input");
            inputAutoIndex.type = "checkbox";
            inputAutoIndex.classList.add("row-check");
            inputAutoIndex.name = "autoIndex" + i;
            inputAutoIndex.id = "autoIndex" + i;

            labelAutoIndex.appendChild(inputAutoIndex);
            var labelAutoIndexText = document.createTextNode("AUTO INDEX");
            labelAutoIndex.appendChild(labelAutoIndexText);

            select.appendChild(option1);
            select.appendChild(option2);
            select.appendChild(option3);
            select.appendChild(option4);
            select.appendChild(option5);

            div.appendChild(inputColumnName);
            div.appendChild(select);
            div.appendChild(inputTypeLength);
            div.appendChild(inputDefaultValue);

            div.appendChild(labelNotNullBox);
            div.appendChild(labelPrimaryKey);
            div.appendChild(labelForeignKey);
            div.appendChild(labelAutoIndex);

            allFields.appendChild(div);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

function createTable() {
    if (validateTable()){
        sendDataToServer();
    } else {
        alert("Erroare la validarea tabelului...");
    } 
}

function validateTable() {
    createTableData = createTableDataInitial;
    columnsList = [];

    var hasPrimaryKey = false; // Flag to track if a primary key is already found

    for (var i = 1; i <= createTableData.numberOfColumns; i++) {
        var columnName = document.getElementById("column" + i).value;
        var columnType = document.getElementById("selectTypeCol" + i).value;
        var columnLength = document.getElementById("length" + i).value;
        var columnDefaultValue = document.getElementById("defaultValue" + i).value;
        var columnNotNull = document.getElementById("notNullBox" + i).checked;
        var columnPrimaryKey = document.getElementById("primaryKey" + i).checked;
        var columnForeignKey = document.getElementById("foreignKey" + i).checked;
        var columnAutoIndex = document.getElementById("autoIndex" + i).checked;

        if (!columnType) {
            alert("Type cannot be null -> column " + i);
            return false;
        }

        if (!columnName) {
            alert("Column name cannot be null. Please provide a valid name for column " + i);
            return false;
        }

        if (columnLength <= 0) {
            alert("Length should be greater than 0 for column " + i);
            return false;
        }

        if (columnAutoIndex && (columnType !== "INT" && columnType !== "NUMBER")) {
            alert("Autoindex can only be true if the column type is 'int' or 'number'. Setting autoindex to false for column " + i);
            // columnAutoIndex = false;
            return false;
        }

        if (columnPrimaryKey) {
            if (hasPrimaryKey) {
                alert("Only one element can have the primary key (pk) set to true. Setting primary key to false for column " + i);
                // columnPrimaryKey = false;
                return false;
            } else {
                hasPrimaryKey = true;
                columnNotNull = true;
            }
        }

        var column = {
            name: columnName,
            type: columnType,
            length: columnLength,
            defaultValue: columnDefaultValue,
            notNull: columnNotNull,
            pk: columnPrimaryKey,
            fk: columnForeignKey,
            autoIndex: columnAutoIndex
        };

        columnsList.push(column);
    }

    createTableData.columnsList = columnsList;
    return true;
}

function sendDataToServer() {
    fetch('http://localhost:3000/dataCreateTable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createTableData)
        })
        .then(response => response.json())
        .then(responseData => {
            console.log('Response from server:', responseData);
            window.location.href = '/homepage';
        })
        .catch(error => {
            console.error('Error:', error);
    });
}