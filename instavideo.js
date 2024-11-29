// Function to handle click and scale the divs with timeout
function handleClick() {
    const clickedContainer = this;
    const containers = document.querySelectorAll('.instagram-container');
    
    // Allow play functionality to execute first, then resize after timeout
    setTimeout(() => {
        containers.forEach(container => {
            if (container !== clickedContainer) {
                // Scale down the other containers to 1/6 of their original size
                container.style.transform = 'scale(0.0067)'; // 1/6
                container.style.transition = 'transform 0.3s'; // Smooth transition
            } else {
                // Restore the size of the clicked container
                container.style.transform = 'scale(2)'; // Original size
                container.style.transition = 'transform 0.3s'; // Smooth transition
            }
        });
    }, 300); // 300ms delay to allow play functionality
}

// Function to reset all containers after a click
function handleReset() {
    const containers = document.querySelectorAll('.instagram-container');
    
    containers.forEach(container => {
        // Reset all containers to their original size
        container.style.transform = 'scale(0.70)'; // Reset to scaled size
        container.style.transition = 'transform 0.3s'; // Smooth transition
    });
}

// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed.');

    // Attach the event listener to all Instagram containers for click event
    document.querySelectorAll('.instagram-container').forEach(container => {
        console.log('Attaching event listener to container:', container);
        container.addEventListener('click', handleClick); // Click event to trigger scale
    });

    // Optionally, you can reset on clicking anywhere else (if needed)
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.instagram-container')) {
            handleReset();
        }
    });
});
