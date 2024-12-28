document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('alertForm');
    const alertTitleInput = document.getElementById('alertTitle');
    const alertMessageInput = document.getElementById('alertMessage');
    const alertPriorityInput = document.getElementById('alertPriority');
    const alertTitleError = document.getElementById('alertTitle-error');
    const alertMessageError = document.getElementById('alertMessage-error');
    const alertPriorityError = document.getElementById('alertPriority-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();  // Prevent form submission
        let isValid = true;

        // Alert Title validation
        if (!alertTitleInput.value) {
            alertTitleError.textContent = 'Alert title is required';
            isValid = false;
        } else {
            alertTitleError.textContent = '';
        }

        // Alert Message validation
        if (!alertMessageInput.value) {
            alertMessageError.textContent = 'Message is required';
            isValid = false;
        } else {
            alertMessageError.textContent = '';
        }

        // Alert Priority validation
        if (!alertPriorityInput.value) {
            alertPriorityError.textContent = 'Priority is required';
            isValid = false;
        } else {
            alertPriorityError.textContent = '';
        }

        // Submit form if valid
        if (isValid) {
            try {
                const response = await fetch('http://127.0.0.1:5000/send-alert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        alertTitle: alertTitleInput.value,
                        alertMessage: alertMessageInput.value,
                        alertPriority: alertPriorityInput.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Alert sent successfully!');
                    form.reset();  // Clear the form
                } else {
                    alert(data.error || 'Failed to send alert.');
                    console.error('Error response:', data);
                }
            } catch (error) {
                alert('An error occurred: ' + error.message);
                console.error('Fetch error:', error);
            }
        }
    });
});
