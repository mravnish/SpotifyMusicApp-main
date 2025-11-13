
// script.js
// document.addEventListener('DOMContentLoaded', function () {
//     const loginForm = document.getElementById('loginForm');
//     const signupForm = document.getElementById('signupForm');

//     function displayMessage(message) {
//         const messageDiv = document.getElementById('message');
//         messageDiv.textContent = message;
//         messageDiv.classList.add('show');
//     }

//     if (loginForm) {
//         loginForm.addEventListener('submit', function (event) {
//             event.preventDefault();
//             displayMessage('Login form submitted!');
//         });
//     }

//     if (signupForm) {
//         signupForm.addEventListener('submit', function (event) {
//             event.preventDefault();
//             displayMessage('Signup form submitted!');
//         });
//     }
// });


// document.addEventListener('DOMContentLoaded', () => {
//     const loginForm = document.getElementById('loginForm');
//     const signupForm = document.getElementById('signupForm');
//     const messageDiv = document.getElementById('message');

//     // Display a message and hide the form
//     function displayMessageWithFormHide(message, form) {
//         form.style.display = 'none'; // Hide the form
//         messageDiv.textContent = message;
//         messageDiv.classList.add('show');

//         // Navigate to another URL after 3 seconds
//         setTimeout(() => {
//             window.location.href = 'http://localhost:5500/';
//         }, 3000);
//     }

//     // Save user data to local storage
//     function saveToLocalStorage(key, data) {
//         localStorage.setItem(key, JSON.stringify(data));
//     }

//     // Mask password
//     function maskPassword(password) {
//         return '*'.repeat(password.length);
//     }

//     // Login Form Submission
//     if (loginForm) {
//         loginForm.addEventListener('submit', (event) => {
//             event.preventDefault();

//             const email = loginForm.loginEmail.value;
//             const password = loginForm.loginPassword.value;
//             const maskedPassword = maskPassword(password);

//             // Save user data to local storage
//             saveToLocalStorage('loggedInUser', { email, password });

//             // Display success message and hide the form
//             displayMessageWithFormHide(
//                 `Login Successful! Email: ${email}, Password: ${maskedPassword}`,
//                 loginForm
//             );
//         });
//     }

//     // Sign-Up Form Submission
//     if (signupForm) {
//         signupForm.addEventListener('submit', (event) => {
//             event.preventDefault();

//             const username = signupForm.signupUsername.value;
//             const email = signupForm.signupEmail.value;
//             const password = signupForm.signupPassword.value;

//             // Save user data to local storage
//             saveToLocalStorage('registeredUser', { username, email, password });

//             // Display success message and hide the form
//             displayMessageWithFormHide(
//                 `Sign-Up Successful! Welcome, ${username}!`,
//                 signupForm
//             );
//         });
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const messageDiv = document.getElementById('message');

    // Display a message and optionally hide the form
    function displayMessage(message, form = null) {
        messageDiv.textContent = message;
        messageDiv.classList.add('show');
        if (form) {
            form.style.display = 'none'; // Hide the form if provided
        }
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 3000); // Message disappears after 3 seconds
    }

    // Save user data to local storage
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Retrieve user data from local storage
    function getFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // Mask password
    function maskPassword(password) {
        return '*'.repeat(password.length);
    }

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = loginForm.loginEmail.value;
            const password = loginForm.loginPassword.value;

            // Retrieve all registered users data from local storage
            const users = getFromLocalStorage('users') || [];

            // Check if the credentials match any of the registered users
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Display success message, hide form, and redirect
                const maskedPassword = maskPassword(password);
                displayMessage(
                    `Login Successful! Email: ${email}, Password: ${maskedPassword}`,
                    loginForm
                );

                // Save logged-in user data in local storage
                saveToLocalStorage('loggedInUser', { email, password });

                // Navigate to the home page after 3 seconds
                setTimeout(() => {
                    window.location.href = 'http://localhost:5500/';
                }, 1500);
            } else {
                // Display error message if credentials are invalid
                displayMessage('Invalid email or password. Please try again.');
            }
        });
    }

    // Sign-Up Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = signupForm.signupUsername.value;
            const email = signupForm.signupEmail.value;
            const password = signupForm.signupPassword.value;

            // Retrieve all registered users data from local storage
            const users = getFromLocalStorage('users') || [];

            // Check if the email is already registered
            if (users.some(u => u.email === email)) {
                // Display an error message for already registered email
                displayMessage('This email is already registered. Please log in instead.');
            } else {
                // Save the new user data to local storage
                users.push({ username, email, password });
                saveToLocalStorage('users', users);

                // Display success message and hide the form
                displayMessage(`Sign-Up Successful! Welcome, ${username}!`, signupForm);

                // Navigate to the home page after 3 seconds
                setTimeout(() => {
                    window.location.href = 'http://localhost:5500/';
                }, 1500);
            }
        });
    }
});

