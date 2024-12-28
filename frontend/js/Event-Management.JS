document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('eventForm');
    const eventTitleInput = document.getElementById('eventTitle');
    const eventDateInput = document.getElementById('eventDate');
    const eventLocationInput = document.getElementById('eventLocation');
    const eventDescriptionInput = document.getElementById('eventDescription');
    const eventTitleError = document.getElementById('eventTitle-error');
    const eventDateError = document.getElementById('eventDate-error');
    const eventLocationError = document.getElementById('eventLocation-error');
    const eventDescriptionError = document.getElementById('eventDescription-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();  
        let isValid = true;

        // Event Title validation
        if (!eventTitleInput.value) {
            eventTitleError.textContent = 'Event title is required';
            isValid = false;
        } else {
            eventTitleError.textContent = '';
        }

        // Event Date validation
        if (!eventDateInput.value) {
            eventDateError.textContent = 'Date is required';
            isValid = false;
        } else {
            eventDateError.textContent = '';
        }

        // Event Location validation
        if (!eventLocationInput.value) {
            eventLocationError.textContent = 'Location is required';
            isValid = false;
        } else {
            eventLocationError.textContent = '';
        }

        // Event Description validation
        if (!eventDescriptionInput.value) {
            eventDescriptionError.textContent = 'Description is required';
            isValid = false;
        } else {
            eventDescriptionError.textContent = '';
        }

        // Submit form if valid
        if (isValid) {
            try {
                const response = await fetch('http://127.0.0.1:5000/create-event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        eventTitle: eventTitleInput.value,
                        eventDate: eventDateInput.value,
                        eventLocation: eventLocationInput.value,
                        eventDescription: eventDescriptionInput.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Event created successfully!');
                    form.reset();  // Clear the form
                } else {
                    alert(data.error || 'Failed to create event.');
                    console.error('Error response:', data);
                }
            } catch (error) {
                alert('An error occurred: ' + error.message);
                console.error('Fetch error:', error);
            }
        }
    });
});
