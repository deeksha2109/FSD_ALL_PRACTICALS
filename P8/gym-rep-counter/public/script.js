let count = 0;
const countDisplay = document.getElementById('count');

function updateCount(amount) {
    count += amount;
    if (count < 0) count = 0;
    countDisplay.textContent = count;
    saveCount();  // 🔴 IMPORTANT: This sends count to server
}

function resetCount() {
    count = 0;
    countDisplay.textContent = count;
    saveCount();
}

function saveCount() {
    fetch('/counter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ count })  // Send count to backend
    });
}

window.onload = () => {
    fetch('/counter')
        .then(res => res.json())
        .then(data => {
            count = data.count || 0;
            countDisplay.textContent = count;
        });
};
