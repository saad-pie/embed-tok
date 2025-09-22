document.addEventListener('DOMContentLoaded', () => {
    const tiktokVideoUrlInput = document.getElementById('tiktokVideoUrl');
    const addVideoButton = document.getElementById('addVideoButton');
    const videoContainer = document.getElementById('videoContainer');
    const errorMessage = document.getElementById('errorMessage');

    let existingVideos = []; // To hold videos loaded from database.json and new ones

    // Function to render videos to the DOM
    const renderVideos = (videos) => {
        videoContainer.innerHTML = ''; // Clear existing videos
        videos.forEach((video, index) => {
            const videoCard = document.createElement('div');
            videoCard.classList.add('video-card');

            const videoLink = `https://www.tiktok.com/@${video.username}/video/${video.id}`;
            // Using a generic web link for TikTok; browsers will often prompt to open the app.
            // Direct app link: `tiktok://vm/${video.id}` could also be used, but requires user action.

            videoCard.innerHTML = `
                <img src="${video.thumbnail}?random=${index + 1}" alt="${video.title}">
                <h3>${video.title}</h3>
                <p>@${video.username}</p>
                <a href="${videoLink}" target="_blank" class="open-in-tiktok-button">Open in TikTok</a>
            `;
            videoContainer.prepend(videoCard); // Add new videos to the top
        });
    };

    // Fetch videos from database.json
    fetch('./database.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            existingVideos = data;
            renderVideos(existingVideos);
        })
        .catch(error => {
            console.error('Error fetching videos:', error);
            errorMessage.textContent = 'Failed to load videos. Please try again later.';
        });

    addVideoButton.addEventListener('click', () => {
        const videoUrl = tiktokVideoUrlInput.value.trim();
        errorMessage.textContent = ''; // Clear previous errors

        if (!videoUrl) {
            errorMessage.textContent = 'Please paste a TikTok video URL.';
            return;
        }

        // Basic validation for TikTok URL and extract video ID
        const tiktokRegex = /tiktok\.com\/@[^\/]+\/video\/(\d+)/;
        const match = videoUrl.match(tiktokRegex);

        if (!match || !match[1]) {
            errorMessage.textContent = 'Invalid TikTok URL. Please use a direct video link (e.g., https://www.tiktok.com/@user/video/123...).';
            return;
        }

        const videoId = match[1];
        // Dummy username, title, and thumbnail for dynamically added videos
        const newVideo = {
            id: videoId,
            username: 'tiktok_user',
            title: 'Suggested TikTok Video',
            thumbnail: `https://picsum.photos/400/300?random=${Date.now()}` // Unique random image
        };

        // Add to the beginning of the local array and re-render
        existingVideos.unshift(newVideo);
        renderVideos(existingVideos);

        tiktokVideoUrlInput.value = ''; // Clear the input field

        // IMPORTANT: For persistence, this 'newVideo' would need to be saved to database.json
        // via a server-side script. As an autonomous agent, I can only provide the updated
        // database.json when I generate a new set of files, not update it client-side.
    });
});
