<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGBD</title>

    <link rel="shortcut icon" type="image/png" href="img/favicon.png">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="mainContainer">
        <div class="container">
            <div class="sgbdLogo">
                <img src="img/logo.png" alt="SGBD Logo">
            </div>

            <!-- <div id="myDiv">Click me</div>
            <div id="myElement" style="display:none;">This is the element to display</div>

            <script>
                var div = document.getElementById('myDiv');
                var element = document.getElementById('myElement');

                div.addEventListener('click', function() {
                element.style.display = 'block';
                });
            </script> -->


            <!--  -->
            <?php
                $databases = array("DummyDatabase1", "DummyDatabase2", "DummyDatabase3", "DummyDatabase4", "DummyDatabase5", "DummyDatabase6"); 
                $selected_database = null;
            ?>

            <div class="card" id="databases">
                <?php
                    if(empty($databases)){
                        echo "<p class=\"instruction\">Momentan nu exista baze de date asociate acestui cont. Va rugam sa creati o noua baza de date.</p>";
                    }
                    else{
                        echo "<p class=\"instruction\">Lista baze de date:</p>";
                    }

                    foreach($databases as $database){
                        echo "<p class=\"databaseName\">
                                <a href = \"index.php?selected_database=$database\">
                                    <span class=\"icon\"></span> $database
                                </a>
                            </p>";
                    }
                ?>
            </div>

            <div style="width: 100px; height: 100px; background-color: red;">
                <?php
                    if (isset($_GET['selected_database'])) {
                        $selected_database = $_GET['selected_database'];
                    }
                    
                    if($selected_database){
                        echo "<p>Sunt in: $selected_database</p>";
                    }
                ?>
            </div>


<!--
            <div class="card" id="commands">
                <p class="instruction">Optinile dvs. pentru administrarea bazei de date.</p>

                <div class="button">Create Table</div>
                <div class="button">Delete Table</div>
                <div class="button">Alter Table</div>
                <div class="button">Insert Values</div>
                <div class="button">Delete Values</div>
                <div class="button">Find Data / Filter</div>
                <div class="button">Run SQL</div>
            </div>

            <div class="card" id="tables">
                <p class="instruction">Baza de Date selectate este Dummy Database 1</p>

                <div class="table-row">
                    <p class="tableNmae">Studenti</p>
                    <div class="button">Describe Table</div>
                </div>
                <div class="table-row">
                    <p class="tableNmae">Profesori</p>
                    <div class="button">Describe Table</div>
                </div>
                <div class="table-row">
                    <p class="tableNmae">Didactic</p>
                    <div class="button">Describe Table</div>
                </div>
                <div class="table-row">
                    <p class="tableNmae">Cursuri</p>
                    <div class="button">Describe Table</div>
                </div>
                <div class="table-row">
                    <p class="tableNmae">Note</p>
                    <div class="button">Describe Table</div>
                </div>
            </div>

            <div class="card" id="data">
                <p class="instruction">Datele din tabela Studenti:</p>
                
                <table id="customers">
                    <tr>
                      <th>ID</th>
                      <th>NR_MATRICOL</th>
                      <th>NUME</th>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>154562045</td>
                      <td>Alin Mariu George Popescu</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>45524654352</td>
                      <td>Alin Mariu George Popescu</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>45554655555</td>
                      <td>Alin Mariu George Popescu</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>545478787979878798</td>
                      <td>Alin Mariu George Popescu</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>5444456</td>
                      <td>Alin Mariu George Popescu</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>798787787879999</td>
                      <td>Alin Mariu George Popescu</td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>1121212121213</td>
                      <td>Alin Mariu George Popescu</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>4787946358794546546</td>
                      <td>Alin Mariu George Popescu</td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>798799999999999999999</td>
                      <td>Alin Mariu George Popescu</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>8788978455668</td>
                      <td>Alin Mariu George Popescu</td>
                    </tr>
                  </table>
            </div>
                -->
            <!--
            <div class="sqlConsole">
                <textarea id="sql" name="sql" rows="4" cols="120">Aici puteti interactiona direct cu baza de date folosing limbajul SQL.</textarea>
                <div class="button">Run</div>
            </div>
        -->
        </div>
    </div>

 <!--
    <hr>
    <hr>
    <hr>
    <hr>
    <hr>

    <div class="createTable">

        <h1>Create table</h1>
        <br>
        <p>Intruduceti numele tabelei si numarul de coloane:</p>
        <form action="">
            <input type="text" id="numeTabel" name="numeTabel">
            <input type="text" id="nrColoaneTabel" name="nrColoaneTabel">
            <input type="submit" value="Submit">
        </form>
        <br>
        <br>

        <p>dupa......</p>
        <br>
        <br>
        <br>

        <h1>Completati structura tabelului:</h1>
        <br>
        <form action="">
            <input type="text" id="numeTabel" name="numeTabel">
            <input type="text" id="nrColoaneTabel" name="nrColoaneTabel">

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <input type="text" id="lungimeValori" name="lungimeValori">

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <input type="checkbox" id="null" name="null" value="NOT NULL">
            <label for="null"> NOT NULL</label>

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>


            <input type="submit" value="Submit">
        </form>

        <form action="">
            <input type="text" id="numeTabel" name="numeTabel">
            <input type="text" id="nrColoaneTabel" name="nrColoaneTabel">

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <input type="text" id="lungimeValori" name="lungimeValori">

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <input type="checkbox" id="null" name="null" value="NOT NULL">
            <label for="null"> NOT NULL</label>

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>


            <input type="submit" value="Submit">
        </form>

        <form action="">
            <input type="text" id="numeTabel" name="numeTabel">
            <input type="text" id="nrColoaneTabel" name="nrColoaneTabel">

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <input type="text" id="lungimeValori" name="lungimeValori">

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <input type="checkbox" id="null" name="null" value="NOT NULL">
            <label for="null"> NOT NULL</label>

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>


            <input type="submit" value="Submit">
        </form>

        <form action="">
            <input type="text" id="numeTabel" name="numeTabel">
            <input type="text" id="nrColoaneTabel" name="nrColoaneTabel">

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <input type="text" id="lungimeValori" name="lungimeValori">

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <input type="checkbox" id="null" name="null" value="NOT NULL">
            <label for="null"> NOT NULL</label>

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>

            <select name="dataTypes" id="dataTypes">
                <option value="INT">INT</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="DATE">DATE</option>
                <option value="TEXT">TEXT</option>
            </select>


            <input type="submit" value="Submit">
        </form>


        <div class="button">Previzualizare sql</div>
    </div>
    

    <hr>
    <hr>
    <hr>
    <hr>
    <hr>


    <div class="describedTable">

    </div>
-->
</body>
</html>