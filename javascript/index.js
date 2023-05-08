const databases = new Array(
    "DummyDatabase1",
    "DummyDatabase2",
    "DummyDatabase3",
    "DummyDatabase4",
    "DummyDatabase5",
    "DummyDatabase6"
    );
    
const tables = new Array(
    "Studenti",
    "Profesori",
    "Didactic",
    "Note",
    "Cursuri",
    "Prieteni"
    );
        
// left panel
var databaseListMessage = document.getElementById('database-panel-message');
var databaseMessage;
var databaseList = document.getElementById('database-ul');

if  (databases.length == 0) {
    databaseMessage = '<p class="database-message">Incercati sa creati o noua baza de date.</p>';
    databaseListMessage.insertAdjacentHTML('afterbegin', databaseMessage);
} else {
    databaseMessage = '<p class="database-message">Databases:</p>';
    databaseListMessage.insertAdjacentHTML('afterbegin', databaseMessage);

    var result = "";
    for (var i = 0; i < databases.length; i++) {
        result = result + "<li class=\"" + databases[i] + "\" onclick=\"showDatabase(\'" + databases[i] + "\')\"><img src=\"img/icons/favicon.svg\" style=\"width: 25px;\"/> " + databases[i] + "</li>";
    }
    databaseList.innerHTML = result;
}

// functions
var selectedDatabase;
function showDatabase(databaseName){
    selectedDatabase = databaseName;
    var selectedDatabaseCss = "background-image: linear-gradient(to right, rgba(233, 128, 116, 0.3) , transparent); border-radius: 5px;";
    var selectedDatabaseCssReverse = "background-image: transparent;";

    var names = document.getElementById("database-ul").getElementsByTagName("li");
    for (let i = 0; i < names.length; i++){
        if(names[i].classList.contains(selectedDatabase)){
            names[i].style.cssText = selectedDatabaseCss;
        } else {
            names[i].style.cssText = selectedDatabaseCssReverse;
        }
    }

    document.getElementsByClassName("select-database")[0].style.display = "none";
    document.getElementsByClassName("homepage")[0].style.display = "flex";
}

var toggle = document.getElementById('toggle');
function databasePanelToggle(){
    var style = "@media screen and (max-width: 1000px){display: none}";

    if (window.getComputedStyle(toggle).display == "flex") {
        toggle.style = style;
    } else {
        toggle.style.display = "flex";
    }
}

function toggleRowData(e){
    var button = e.currentTarget;
    var rowData = e.currentTarget.closest(".row").querySelector(".row-data");
    var style = "@media screen and (max-width: 1000px){display: none}";
    
    if (rowData.classList.contains("visible")) {
        rowData.classList.remove("visible");
        rowData.style = style;
    } else {
        rowData.classList.add("visible");
        rowData.style.display = "flex";
    }
}