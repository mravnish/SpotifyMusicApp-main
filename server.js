const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' folder
// app.use(express.json());

// Routes to serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'LogIn.html'));
    const { loginEmail, loginPassword } = req.body;
    // console.log(`Login Email: ${loginEmail}, Password: ${loginPassword}`);
    res.json({ message: 'Login form submitted!' });
});

// API routes for form submissions
app.post('/login', (req, res) => {
    const { loginEmail, loginPassword } = req.body;
    console.log(`Login Email: ${loginEmail}, Password: ${loginPassword}`);
    res.json({ message: 'Login form submitted!' });
});

app.post('/signup', (req, res) => {
    const { signupUsername, signupEmail, signupPassword } = req.body;
    console.log(`Signup Username: ${signupUsername}, Email: ${signupEmail}, Password: ${signupPassword}`);
    res.json({ message: 'Signup form submitted!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


