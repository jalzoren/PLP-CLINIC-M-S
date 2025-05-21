document.addEventListener('DOMContentLoaded', function () {
    fetchUnavailableItems();
});

// Fetch unavailable items and update notification
function fetchUnavailableItems() {
    fetch('../php/fetch_items.php')
        .then(response => response.json())
        .then(items => {
            const unavailableItems = items.filter(item => item.Quantity <= 0);
            const notificationMessages = document.getElementById('notificationMessages');
            notificationMessages.innerHTML = '';

            if (unavailableItems.length === 0) {
                notificationMessages.innerHTML = '<p>No unavailable items.</p>';
            } else {
                unavailableItems.forEach(item => {
                    const p = document.createElement('p');
                    p.textContent = `${item.Item_Name} (${item.Category}) - Quantity: ${item.Quantity}`;
                    notificationMessages.appendChild(p);
                });
            }

            // Update localStorage for cross-page consistency
            localStorage.setItem('unavailableItems', JSON.stringify(unavailableItems));
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            notificationMessages.innerHTML = '<p>Error loading notifications.</p>';
        });
}

function showUnavailablePopup() {
    const unavailableItems = JSON.parse(localStorage.getItem('unavailableItems') || '[]');
    const listContainer = document.getElementById('unavailableItemsList');
    listContainer.innerHTML = '';

    if (unavailableItems.length === 0) {
        listContainer.innerHTML = '<p>No unavailable items.</p>';
    } else {
        unavailableItems.forEach(item => {
            const p = document.createElement('p');
            p.textContent = `${item.Item_Name} (${item.Category}) - Quantity: ${item.Quantity}`;
            listContainer.appendChild(p);
        });
    }

    document.getElementById('unavailablePopup').style.display = 'flex';
}

function closeUnavailablePopup() {
    document.getElementById('unavailablePopup').style.display = 'none';
}