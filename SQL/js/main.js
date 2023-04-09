let btn = document.querySelector('.sql-run-button');
let el = document.querySelector('.sql-output-area');
btn.addEventListener('click', function () {
  el.scrollIntoView({behavior: "smooth"});
  document.getElementById("sql-output").value = "0 rows selected";
});
