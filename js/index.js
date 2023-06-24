function loginClick() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginData = {
        username: username, password: password,
    };

    fetch('http://localhost:3000/login', {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, mode: 'no-cors', body: JSON.stringify(loginData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === 'Success!') {
                document.getElementById('login-status').textContent = 'Logged in!';
                window.location.href = 'home.html';
            } else {
                document.getElementById('login-status').textContent = 'Invalid username or password.';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function forgotClick() {
    window.location.href = "forgotPassword.html";
}

function newClick() {
    window.location.href = "newAccount.html";
}