document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const passwordEye = document.getElementById('password-eye');

    // Password toggle function
    function togglePassword(input, eye) {
        if (input.type === 'password') {
            input.type = 'text';
            eye.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            input.type = 'password';
            eye.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    }

    // Password toggle functionality
    passwordEye.addEventListener('click', () => {
        togglePassword(passwordInput, passwordEye);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent form submission
        let isValid = true;

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

        // Submit form if valid
        if (isValid) {
            try {
                const response = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailInput.value,
                        password: passwordInput.value,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Login successful!');
                    // Adjust the path based on the location of your login.html
                    window.location.href = '../pages/user-dashboard.html'; 
                } else {
                    alert(data.error || 'Login failed.');
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
});
