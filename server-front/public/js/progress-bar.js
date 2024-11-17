
function showProgressModal() {
    const modal = document.getElementById('progress-modal');
    if (modal) {
        modal.style.display = 'flex'; // Show the modal
    }
}

function hideProgressModal() {
    const modal = document.getElementById('progress-modal');
    if (modal) {
        modal.style.display = 'none'; // Hide the modal
    }
}