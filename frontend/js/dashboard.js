// Handle panel navigation
function setupPanelNavigation() {
    const navLinks = document.querySelectorAll('.dashboard-nav a[data-panel]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const panelId = link.getAttribute('data-panel');

            // Update active states
            document.querySelectorAll('.dashboard-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.querySelectorAll('.dashboard-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });

            document.getElementById(panelId).classList.add('active');
            link.classList.add('active');
        });
    });
}


// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    setupPanelNavigation();
    setupLogout();
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('incidentForm');
    const incidentTypeInput = document.getElementById('incidentType');
    const incidentDescriptionInput = document.getElementById('incidentDescription');
    const incidentLocationInput = document.getElementById('incidentLocation');
    const incidentPhotoInput = document.getElementById('incidentPhoto');
    const incidentTypeError = document.getElementById('incidentType-error');
    const incidentDescriptionError = document.getElementById('incidentDescription-error');
    const incidentLocationError = document.getElementById('incidentLocation-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();  
        let isValid = true;

        // Incident Type validation
        if (!incidentTypeInput.value) {
            incidentTypeError.textContent = 'Incident type is required';
            isValid = false;
        } else {
            incidentTypeError.textContent = '';
        }

        // Incident Description validation
        if (!incidentDescriptionInput.value) {
            incidentDescriptionError.textContent = 'Description is required';
            isValid = false;
        } else {
            incidentDescriptionError.textContent = '';
        }

        // Incident Location validation
        if (!incidentLocationInput.value) {
            incidentLocationError.textContent = 'Location is required';
            isValid = false;
        } else {
            incidentLocationError.textContent = '';
        }

        // Submit form if valid
        if (isValid) {
            const formData = new FormData();
            formData.append('incidentType', incidentTypeInput.value);
            formData.append('incidentDescription', incidentDescriptionInput.value);
            formData.append('incidentLocation', incidentLocationInput.value);
            formData.append('incidentPhoto', incidentPhotoInput.files[0]);

            try {
                const response = await fetch('http://127.0.0.1:5000/report-incident', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Incident report submitted successfully!');
                    form.reset();  // Clear the form
                } else {
                    alert(data.error || 'Failed to submit incident report.');
                    console.error('Error response:', data);
                }
            } catch (error) {
                alert('An error occurred: ' + error.message);
                console.error('Fetch error:', error);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:5000/user-overview')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = data.recent_incidents;
            document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = data.active_alerts;
            document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = data.upcoming_events;
        })
        .catch(error => console.error('Error fetching overview data:', error));
});
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display alerts
    fetch('http://127.0.0.1:5000/fetch-alerts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(alerts => {
            const alertsList = document.getElementById('alertsList');
            alerts.forEach(alert => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${alert.title}</td>
                    <td>${alert.message}</td>
                    <td>${alert.priority}</td>
                `;
                alertsList.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching alerts:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display events
    fetch('http://127.0.0.1:5000/fetch-events')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(events => {
            const eventsList = document.getElementById('eventsList');
            events.forEach(event => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${event.title}</td>
                    <td>${new Date(event.event_date).toLocaleDateString()}</td>
                    <td>${event.location}</td>
                    <td>${event.description}</td>
                `;
                eventsList.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching events:', error));
});
