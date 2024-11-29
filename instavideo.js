// Function to handle resizing of Instagram containers on touchstart
function handleTouchStart() {
    const touchedContainer = this;
    const containers = document.querySelectorAll('.instagram-container');

    containers.forEach(container => {
        if (container !== touchedContainer) {
            // Scale down the other containers to 1/6 of their original size
            container.style.transform = 'scale(0.0067)'; // 1/6
            container.style.transition = 'transform 0.3s'; // Smooth transition
        } else {
            // Enlarge the touched container
            container.style.transform = 'scale(2)'; // Original size
            container.style.transition = 'transform 0.3s'; // Smooth transition
        }
    });
}

// Function to reset all containers to their original size on touchend
function handleTouchEnd() {
    const containers = document.querySelectorAll('.instagram-container');

    containers.forEach(container => {
        // Reset all containers to their default size
        container.style.transform = 'scale(0.70)'; // Reset to scaled size
        container.style.transition = 'transform 0.3s'; // Smooth transition
    });
}

// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed.');

    // Attach touch event listeners to all Instagram containers
    const containers = document.querySelectorAll('.instagram-container');

    containers.forEach(container => {
        console.log('Attaching touch event listeners to container:', container);

        // Handle touchstart to resize the container
        container.addEventListener('touchstart', handleTouchStart);

        // Handle touchend to reset all containers
        container.addEventListener('touchend', handleTouchEnd);
    });
});
