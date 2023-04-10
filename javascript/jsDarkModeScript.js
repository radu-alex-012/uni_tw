const toggleThemeButton = document.getElementById('toggle-theme');

toggleThemeButton.addEventListener('click', function() {
    const body = document.body;
    body.classList.toggle('dark');
});