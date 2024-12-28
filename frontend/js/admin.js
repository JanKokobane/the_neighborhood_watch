// Handle panel navigation
function setupPanelNavigation() {
    const navLinks = document.querySelectorAll('.dashboard-nav a[data-panel]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const panelId = link.getAttribute('data-panel');
            
            document.querySelectorAll('.dashboard-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.querySelectorAll('.dashboard-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            const panelElement = document.getElementById(panelId);
            if (panelElement) {
                panelElement.classList.add('active');
            }
            link.classList.add('active');
        });
    });
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    setupPanelNavigation();
});

// Fetch and display users
fetch('http://127.0.0.1:5000/fetch-users')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(users => {
        const usersList = document.getElementById('usersList');
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>Active</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.username}')">Delete</button>
                </td>
            `;
            usersList.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching users:', error));

// Delete user function
function deleteUser(username) {
    if (confirm(`Are you sure you want to delete user ${username}?`)) {
        fetch(`http://127.0.0.1:5000/delete-user/${username}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('User deleted successfully!');
                location.reload(); // Refresh the page to reflect changes
            } else {
                return response.json().then(data => {
                    alert(data.error || 'Failed to delete user.');
                });
            }
        })
        .catch(error => console.error('Error deleting user:', error));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display overview data
    fetch('http://127.0.0.1:5000/admin-overview')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('total-users').textContent = data.total_users;
            document.getElementById('pending-reports').textContent = data.total_incidents;
            document.getElementById('active-alerts').textContent = data.total_alerts;
        })
        .catch(error => console.error('Error fetching overview data:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display incidents
    fetch('http://127.0.0.1:5000/fetch-incidents')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(incidents => {
            const incidentsList = document.getElementById('incidentsList');
            incidents.forEach(incident => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(incident.reported_at).toLocaleString()}</td>
                    <td>${incident.incident_type}</td>
                    <td>${incident.location}</td>
                    <td>${incident.description}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteIncident('${incident.incident_id}')">Delete</button>
                    </td>
                `;
                incidentsList.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching incidents:', error));
});

// Delete incident function
function deleteIncident(incidentId) {
    if (confirm(`Are you sure you want to delete incident ${incidentId}?`)) {
        fetch(`http://127.0.0.1:5000/delete-incident/${incidentId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Incident deleted successfully!');
                location.reload(); // Refresh the page to reflect changes
            } else {
                return response.json().then(data => {
                    alert(data.error || 'Failed to delete incident.');
                });
            }
        })
        .catch(error => console.error('Error deleting incident:', error));
    }
}


