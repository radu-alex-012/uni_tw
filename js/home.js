const navbarButton = document.querySelector('.navbar-button');
const sidebar = document.querySelector('.sidebar');
const baseUrl = 'http://localhost:3000';

document.getElementById('db-import-button').addEventListener('click', () => {
    document.getElementById('db-import').click()
});

navbarButton.addEventListener('click', function () {
    sidebar.classList.toggle('sidebar-minimized');
});

function urlParams(endpoint, queryParams) {
    const url = new URL(`${baseUrl}${endpoint}`);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
    return url;
}

function getSelectedDatabase() {
    const radios = document.getElementsByClassName('database-radio');

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

function initSidebar() {
    fetch('/sidebar')
        .then(response => response.json())
        .then(data => {
            const username = document.getElementById('username');
            username.textContent = data.username;

            const databaseList = document.getElementById('database-list');

            data.databases.forEach((item, index) => {
                const radio = document.createElement('input');
                radio.setAttribute('type', 'radio');
                radio.setAttribute('value', item);
                radio.setAttribute('class', 'database-radio');
                radio.setAttribute('name', 'database');
                radio.id = 'db' + (index + 1);
                if (radio.id === 'db1') {
                    radio.setAttribute('checked', '');
                }
                radio.addEventListener('click', populateWithData);

                const label = document.createElement('label');
                label.setAttribute('for', radio.id);
                label.classList.add('database-name');
                label.textContent = item;

                databaseList.appendChild(radio);
                databaseList.appendChild(label);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function populateWithData() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            const databases = data.databases;
            const tableList = document.getElementById('table-list');
            tableList.innerHTML = '';
            const selectedDatabase = getSelectedDatabase();
            const selectedDb = databases.find(db => db.name === selectedDatabase);

            if (selectedDb) {
                for (const table of selectedDb.tables) {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.id = 'table-card';

                    const tableName = document.createElement('div');
                    tableName.classList.add('table-name-title');
                    tableName.textContent = table.name;
                    card.appendChild(tableName);

                    const tableViewerContainer = document.createElement('div');
                    tableViewerContainer.classList.add('table-viewer-container');

                    const tableViewer = document.createElement('table');
                    tableViewer.classList.add('table-viewer');

                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');

                    let columnHeader = document.createElement('th');
                    columnHeader.textContent = 'Name';
                    headerRow.appendChild(columnHeader);

                    columnHeader = document.createElement('th');
                    columnHeader.textContent = 'Type';
                    headerRow.appendChild(columnHeader);

                    columnHeader = document.createElement('th');
                    columnHeader.textContent = 'Default value';
                    headerRow.appendChild(columnHeader);

                    columnHeader = document.createElement('th');
                    columnHeader.textContent = 'Nullable';
                    headerRow.appendChild(columnHeader);

                    columnHeader = document.createElement('th');
                    columnHeader.textContent = 'Primary key';
                    headerRow.appendChild(columnHeader);

                    columnHeader = document.createElement('th');
                    columnHeader.textContent = 'Foreign key';
                    headerRow.appendChild(columnHeader);

                    columnHeader = document.createElement('th');
                    columnHeader.textContent = 'Auto increment';
                    headerRow.appendChild(columnHeader);

                    thead.appendChild(headerRow);
                    tableViewer.appendChild(thead);

                    const tbody = document.createElement('tbody');
                    let insertPosition = 1;

                    for (const column of table.columns) {
                        const row = document.createElement('tr');

                        let cell = document.createElement('td');
                        cell.textContent = column.name;
                        row.appendChild(cell);

                        cell = document.createElement('td');
                        cell.textContent = column.type.toUpperCase();
                        row.appendChild(cell);

                        cell = document.createElement('td');
                        cell.textContent = column.defaultValue;
                        row.appendChild(cell);

                        cell = document.createElement('td');
                        cell.textContent = column.isNullable ? 'Yes' : 'No';
                        row.appendChild(cell);

                        cell = document.createElement('td');
                        cell.textContent = column.isPrimaryKey ? 'Yes' : 'No';
                        row.appendChild(cell);

                        cell = document.createElement('td');
                        cell.textContent = column.isForeignKey ? 'Yes' : 'No';
                        row.appendChild(cell);

                        cell = document.createElement('td');
                        cell.textContent = column.isAutoIncrement ? 'Yes' : 'No';
                        row.appendChild(cell);

                        tbody.appendChild(row);
                    }

                    tableViewer.appendChild(tbody);
                    tableViewerContainer.appendChild(tableViewer);

                    // Commands container
                    const commandsContainer = document.createElement('div');
                    commandsContainer.classList.add('commands');

                    // Command buttons
                    const dropTableButton = document.createElement('button');
                    dropTableButton.classList.add('command-button');
                    let textSpan = document.createElement('span');
                    textSpan.textContent = 'Drop table';
                    dropTableButton.appendChild(textSpan);
                    commandsContainer.appendChild(dropTableButton);
                    dropTableButton.addEventListener('click', () => {
                        const confirmation = confirm('Are you sure you want to drop the table ' + tableName.textContent + ' from the database ' + selectedDatabase + '?');
                        if (confirmation) {
                            fetch(urlParams('/drop', {
                                schema: selectedDatabase,
                                table: tableName.textContent
                            }), {
                                method: 'DELETE',
                            })
                                .then(response => response.text())
                                .then(data => {
                                    if (data === 'Success!') {
                                        window.location.href = 'http://localhost:3000/home';
                                    }
                                })
                                .catch(error => {
                                    console.error(error);
                                });
                        }
                    });

                    const alterTableButton = document.createElement('button');
                    alterTableButton.classList.add('command-button');
                    textSpan = document.createElement('span');
                    textSpan.textContent = 'Alter table';
                    alterTableButton.addEventListener('click', () => {
                        window.location.href= `/alter?schema=${selectedDatabase}&table=${tableName.textContent}`;
                    });
                    alterTableButton.appendChild(textSpan);
                    commandsContainer.appendChild(alterTableButton);

                    const insertDataButton = document.createElement('button');
                    insertDataButton.classList.add('command-button');
                    textSpan = document.createElement('span');
                    textSpan.textContent = 'Insert data';
                    insertDataButton.addEventListener('click', () => {
                        // Handle insert data action
                        // ...
                    });
                    insertDataButton.appendChild(textSpan);
                    commandsContainer.appendChild(insertDataButton);

                    const viewDataButton = document.createElement('button');
                    viewDataButton.classList.add('command-button');
                    textSpan = document.createElement('span');
                    textSpan.textContent = 'View data';
                    viewDataButton.addEventListener('click', () => {
                        // Handle view data action
                        // ...
                    });
                    viewDataButton.appendChild(textSpan);
                    commandsContainer.appendChild(viewDataButton);

                    const updateDataButton = document.createElement('button');
                    updateDataButton.classList.add('command-button');
                    textSpan = document.createElement('span');
                    textSpan.textContent = 'Update data';
                    updateDataButton.addEventListener('click', () => {
                        // Handle update data action
                        // ...
                    });
                    updateDataButton.appendChild(textSpan);
                    commandsContainer.appendChild(updateDataButton);

                    const deleteDataButton = document.createElement('button');
                    deleteDataButton.classList.add('command-button');
                    textSpan = document.createElement('span');
                    textSpan.textContent = 'Delete data';
                    deleteDataButton.addEventListener('click', () => {
                        // Handle delete data action
                        // ...
                    });
                    deleteDataButton.appendChild(textSpan);
                    commandsContainer.appendChild(deleteDataButton);

                    card.appendChild(tableViewerContainer);
                    card.appendChild(commandsContainer);
                    tableList.appendChild(card);
                    insertPosition++;
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
}

window.onload = function () {
    initSidebar();
    populateWithData();
};