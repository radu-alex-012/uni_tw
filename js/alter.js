const baseUrl = 'http://localhost:3000';

function getNewOption(value) {
    const newOption = document.createElement('option');
    newOption.setAttribute('value', value);
    newOption.textContent = value;
    return newOption;
}

function getBinarySelectCell(defaultValue, n) {
    const cell = document.createElement('td');
    const label = document.createElement('label');
    label.setAttribute('for', 'field' + n);
    const select = document.createElement('select');
    select.setAttribute('class', 'table-cell');
    select.setAttribute('id', 'field' + n);
    const option1 = getNewOption('No');
    const option2 = getNewOption('Yes');
    if (defaultValue) {
        option2.setAttribute('selected', '');
    }
    select.appendChild(option1);
    select.appendChild(option2);
    cell.appendChild(label);
    cell.appendChild(select);
    return cell;
}

function defaultOptionValues(select, defaultOption) {
    const dataTypes = [
        "INT",
        "TINYINT",
        "SMALLINT",
        "BIGINT",
        "DECIMAL",
        "FLOAT",
        "DOUBLE",
        "CHAR",
        "VARCHAR",
        "TEXT",
        "TINYTEXT",
        "MEDIUMTEXT",
        "LONGTEXT",
        "ENUM",
        "SET",
        "DATE",
        "TIME",
        "DATETIME",
        "TIMESTAMP",
        "BOOLEAN",
        "BLOB",
        "TINYTEXT",
        "MEDIUMTEXT",
        "LONGTEXT",
        "JSON"
    ];

    for (const dataType of dataTypes) {
        let newOption = getNewOption(dataType);
        if (dataType === defaultOption.toUpperCase()) {
            newOption.setAttribute('selected', '');
        }
        select.appendChild(newOption);
    }
}

function getMaxLength(type) {
    const typesWithLength = {
        VARCHAR: 65535,
        CHAR: 255,
        TEXT: 65535,
        TINYTEXT: 255,
        MEDIUMTEXT: 16777215,
        LONGTEXT: 4294967295,
        BLOB: 65535,
        TINYBLOB: 255,
        MEDIUMBLOB: 16777215,
        LONGBLOB: 4294967295
    };
    return typesWithLength[type.toUpperCase()] || 0;
}

function urlParams(endpoint, queryParams) {
    const url = new URL(`${baseUrl}${endpoint}`);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
    return url;
}

function populateWithData() {
    fetch(urlParams('/alterData', {
        schema: selectedDatabase,
        table: tableName
    }), {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            const columns = data;
            const tableNameInput = document.getElementById('field0');
            tableNameInput.setAttribute('placeholder', tableName);
            const tableBody = document.getElementById('table-body');
            let n = 1;

            columns.forEach(column => {
                const row = document.createElement('tr');

                let cell = document.createElement('td');
                let label = document.createElement('label');
                label.setAttribute('for', 'field' + n);
                let input = document.createElement('input');
                input.setAttribute('class', 'table-cell');
                input.setAttribute('id', 'field' + n);
                input.setAttribute('type', 'text');
                input.setAttribute('placeholder', column.name);
                n++;
                cell.appendChild(label);
                cell.appendChild(input);
                row.appendChild(cell);

                cell = document.createElement('td');
                label = document.createElement('label');
                label.setAttribute('for', 'field' + n);
                let select = document.createElement('select');
                select.setAttribute('class', 'table-cell');
                select.setAttribute('id', 'field' + n);
                defaultOptionValues(select, column.type);
                n++;
                cell.appendChild(label);
                cell.appendChild(select);
                row.appendChild(cell);

                cell = document.createElement('td');
                label = document.createElement('label');
                label.setAttribute('for', 'field' + n);
                input = document.createElement('input');
                input.setAttribute('class', 'table-cell');
                input.setAttribute('id', 'field' + n);
                input.setAttribute('type', 'number');
                input.setAttribute('min', '0');
                if (getMaxLength(column.type) === 0) {
                    input.disabled = true;
                }
                input.setAttribute('max', getMaxLength(column.type));
                input.setAttribute('value', column.length);
                n++;
                cell.appendChild(label);
                cell.appendChild(input);
                row.appendChild(cell);

                const typeField = row.children[row.children.length - 2].children[1];
                const lengthField = row.children[row.children.length - 1].children[1];
                typeField.addEventListener('change', function () {
                    lengthField.value = '';
                    lengthField.disabled = getMaxLength(this.value) === 0;
                    lengthField.max = getMaxLength(this.value);
                });

                cell = document.createElement('td');
                label = document.createElement('label');
                label.setAttribute('for', 'field' + n);
                input = document.createElement('input');
                input.setAttribute('class', 'table-cell');
                input.setAttribute('id', 'field' + n);
                input.setAttribute('type', 'text');
                input.setAttribute('placeholder', column.defaultValue);
                n++;
                cell.appendChild(label);
                cell.appendChild(input);
                row.appendChild(cell);

                row.appendChild(getBinarySelectCell(column.nullable, n));
                n++;

                row.appendChild(getBinarySelectCell(column.primaryKey, n));
                n++;

                row.appendChild(getBinarySelectCell(column.foreignKey, n));
                n++;

                row.appendChild(getBinarySelectCell(column.autoIncrement, n));
                n++;

                tableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error(err);
        });
}

function isNumerical(dataType) {
    const numericalTypes = ['TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'INTEGER', 'BIGINT', 'FLOAT', 'DOUBLE', 'DECIMAL'];
    return numericalTypes.includes(dataType.toUpperCase());
}

function generateAlterTableStatement() {
    const tableFields = document.querySelectorAll('#table-body tr');
    const alterTableStatements = [];
    let n = 1;

    tableFields.forEach((row) => {
        const fieldInitialName = row.querySelector(`#field${n}`).getAttribute('placeholder');
        const fieldName = row.querySelector(`#field${n}`).value;
        const fieldInitialType = row.querySelector(`#field${n + 1}`).getAttribute('placeholder');
        const fieldType = row.querySelector(`#field${n + 1}`).value;
        const fieldInitialLength = row.querySelector(`#field${n + 2}`).getAttribute('placeholder');
        const fieldLength = row.querySelector(`#field${n + 2}`).value;
        const initialDefaultValue = row.querySelector(`#field${n + 3}`).getAttribute('placeholder');
        const defaultValue = row.querySelector(`#field${n + 3}`).value;
        const nullable = row.querySelector(`#field${n + 4}`).value === 'Yes';
        const primaryKey = row.querySelector(`#field${n + 5}`).value === 'Yes';
        const foreignKey = row.querySelector(`#field${n + 6}`).value === 'Yes';
        const autoIncrement = row.querySelector(`#field${n + 7}`).value === 'Yes';
        n += 8;

        let columnDefinition = ``;
        if (fieldName) {
            columnDefinition += `\`${fieldName}\``;
        }
        if (fieldType) {
            columnDefinition += ` ${fieldType}`;
        }
        if (fieldLength && fieldLength > 0) {
            columnDefinition += `(${fieldLength})`;
        }
        if (!nullable) {
            columnDefinition += ' NOT NULL';
        }
        if (defaultValue) {
            if (isNumerical(fieldType)) {
                columnDefinition += ` DEFAULT ${defaultValue}`;
            }
            else {
                columnDefinition += ` DEFAULT \`${defaultValue}\``;
            }
        }
        if (primaryKey) {
            columnDefinition += ' PRIMARY KEY';
        }
        if (foreignKey) {
            columnDefinition += ' FOREIGN KEY';
        }
        if (autoIncrement) {
            columnDefinition += ' AUTO_INCREMENT';
        }

        if (columnDefinition) {
            alterTableStatements.push(`ALTER TABLE \`${tableName}\` CHANGE COLUMN \`${fieldInitialName}\` ${columnDefinition};`);
        }
    });

    const initialTableName = document.getElementById('field0').placeholder;
    const finalTableName = document.getElementById('field0').value;
    if (finalTableName) {
        alterTableStatements.push(`ALTER TABLE ${initialTableName} RENAME ${finalTableName};`);
    }

    console.log('Composed SQL:\n' + alterTableStatements);

    fetch('/execute-sql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            schema: selectedDatabase,
            sql: alterTableStatements
        })
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/home';
            } else {
                console.error('Failed to execute SQL statement');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function handleSubmit(event) {
    event.preventDefault();
    generateAlterTableStatement();
}

document.getElementById('alter-button').addEventListener('click', handleSubmit);

window.onload = function () {
    populateWithData();
};