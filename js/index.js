function hasSessionCookie() {
    const cookies = document.cookie;
    const cookiePairs = cookies.split(';');

    for (const pair of cookiePairs) {
        const [key, value] = pair.trim().split('=');
        if (key === 'sessionCookie' && (value === 'Session' || value === '')) {
            return true;
        }
    }

    return false;
}

if (!hasSessionCookie() && window.location.href !== 'http://localhost:3000/') {
    window.location.href = 'http://localhost:3000/';
}

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const formData = {
        email: email, password: password
    };
    const jsonData = JSON.stringify(formData);
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData,
    })
        .then((response) => response.text())
        .then((data) => {
            if (data === 'Success!') {
                window.location.href = 'http://localhost:3000/home';
            } else {
                document.getElementById('login-status').innerHTML = 'Invalid username or password.';
            }
        })
        .catch((error) => {
            console.error(error);
        });
});


function forgotClick() {
    window.location.href = 'http://localhost:3000/forgotPassword';
}

function newClick() {
    window.location.href = 'http://localhost:3000/register';
}
