    document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const fullNameInput = document.getElementById('full_name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const usernameError = document.getElementById('username-error');
    const fullNameError = document.getElementById('full_name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();  // Prevent form submission
        let isValid = true;

        // Username validation
        if (!usernameInput.value) {
            usernameError.textContent = 'Username is required';
            isValid = false;
        } else {
            usernameError.textContent = '';
        }

        // Full Name validation
        if (!fullNameInput.value) {
            fullNameError.textContent = 'Full Name is required';
            isValid = false;
        } else {
            fullNameError.textContent = '';
        }

        // Email validation
        if (!emailInput.value) {
            emailError.textContent = 'Email is required';
            isValid = false;
        } else if (!validateEmail(emailInput.value)) {
            emailError.textContent = 'Invalid email format';
            isValid = false;
        } else {
            emailError.textContent = '';
        }

        // Password validation
        if (!passwordInput.value) {
            passwordError.textContent = 'Password is required';
            isValid = false;
        } else if (passwordInput.value.length < 8) {
            passwordError.textContent = 'Password must be at least 8 characters';
            isValid = false;
        } else {
            passwordError.textContent = '';
        }

        // Confirm password validation
        if (!confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'Confirm password is required';
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordError.textContent = 'Passwords do not match';
            isValid = false;
        } else {
            confirmPasswordError.textContent = '';
        }

        // Submit form if valid
        if (isValid) {
            try {
                const response = await fetch('http://127.0.0.1:5000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: usernameInput.value,
                        fullname: fullNameInput.value,
                        email: emailInput.value,
                        password: passwordInput.value
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful!');
                    // Redirect to the login page
                    window.location.href = './login.html';
                } else {
                    alert(data.error || 'Registration failed.');
                    console.error('Error response:', data);
                }
            } catch (error) {
                alert('An error occurred: ' + error.message);
                console.error('Fetch error:', error);
            }
        }
    });

    // Email validation function
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    // Toggle password visibility
    window.togglePassword = function(id, eyeIconId) {
        const passwordField = document.getElementById(id);
        const eyeIcon = document.getElementById(eyeIconId);

        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            passwordField.type = 'password';
            eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
        }
    };
});

