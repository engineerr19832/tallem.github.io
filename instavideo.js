function handleTouchStart(event) {
    const touchedContainer = event.currentTarget;
    const containers = document.querySelectorAll('.instagram-container');
    
    // Delay resize to let play functionality execute
    setTimeout(() => {
        containers.forEach(container => {
            if (container !== touchedContainer) {
                container.style.transform = 'scale(0.0067)';
                container.style.transition = 'transform 0.3s';
            } else {
                container.style.transform = 'scale(2)';
                container.style.transition = 'transform 0.3s';
            }
        });
    }, 100); // Adjust timeout as necessary
}

function handleTouchEnd() {
    const containers = document.querySelectorAll('.instagram-container');
    containers.forEach(container => {
        container.style.transform = 'scale(0.70)';
        container.style.transition = 'transform 0.3s';
    });
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.instagram-container');
    containers.forEach(container => {
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchend', handleTouchEnd);
    });
});
