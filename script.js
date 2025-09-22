document.addEventListener('DOMContentLoaded', () => {
    const tiktokEmbedCodeInput = document.getElementById('tiktokEmbedCode');
    const addVideoButton = document.getElementById('addVideoButton');
    const videoContainer = document.getElementById('videoContainer');
    const errorMessage = document.getElementById('errorMessage');

    addVideoButton.addEventListener('click', () => {
        const embedCode = tiktokEmbedCodeInput.value.trim();
        errorMessage.textContent = ''; // Clear previous errors

        if (!embedCode) {
            errorMessage.textContent = 'Please paste a TikTok embed code.';
            return;
        }

        // Basic validation: check if it looks like a TikTok blockquote embed
        if (!embedCode.includes('<blockquote class="tiktok-embed"') || !embedCode.includes('data-video-id=')) {
            errorMessage.textContent = 'Invalid TikTok embed code. Please ensure it is the full <blockquote> element.';
            return;
        }

        // Create a wrapper div for styling and to contain the embed
        const embedWrapper = document.createElement('div');
        embedWrapper.classList.add('tiktok-embed-wrapper');
        embedWrapper.innerHTML = embedCode;

        videoContainer.prepend(embedWrapper); // Add new videos to the top

        tiktokEmbedCodeInput.value = ''; // Clear the input field

        // The tiktok.com/embed.js script, loaded once in index.html, should automatically
        // detect and render new blockquote.tiktok-embed elements added to the DOM.
        // If it doesn't, you might need to manually trigger a re-scan. For this simple setup,
        // relying on TikTok's script to handle new DOM elements is the expected behavior.
    });
});