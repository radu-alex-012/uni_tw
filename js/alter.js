document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('alterForm');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get the selected values from the select dropdowns
        const column1Value = document.getElementById('column1').value;
        const column2Value = document.getElementById('column2').value;
        const column3Value = document.getElementById('column3').value;

        // Perform any further actions with the selected values
        // ...

        // Example: Display the selected values in the console
        console.log('Selected Values:');
        console.log('Column 1:', column1Value);
        console.log('Column 2:', column2Value);
        console.log('Column 3:', column3Value);
    });
});
