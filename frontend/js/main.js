document.addEventListener('DOMContentLoaded', function () {
    const featureCards = document.querySelectorAll('.feature-card');
    let currentIndex = 0; // Start with the first feature

    function showFeature() {
        const title = featureCards[currentIndex].querySelector('.feature-title');
        const description = featureCards[currentIndex].querySelector('.feature-description');

        // Show the title and animate the underline
        title.classList.add('animate');
        description.classList.add('animate');

        setTimeout(() => {
            // Fade out the title and description
            title.classList.remove('animate');
            title.classList.add('fade-out');
            description.classList.remove('animate');
            description.classList.add('fade-out');

            setTimeout(() => {
                // Reset after fade out
                title.classList.remove('fade-out');
                description.classList.remove('fade-out');

                // Move to the next feature or loop back to the first
                currentIndex = (currentIndex + 1) % featureCards.length;
                showFeature(); // Call the function again to show the next feature
            }, 1000); // Wait for the fade-out to complete before resetting

        }, 3000); // Time to display each feature before fading out
    }

    showFeature(); // Start the loop
});


