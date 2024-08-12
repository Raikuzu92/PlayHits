document.addEventListener("DOMContentLoaded", function () {
    // Select DOM elements
    const playlistItems = document.querySelectorAll(".playlist-item");
    const songItems = document.querySelectorAll(".song-item");
    const searchForm = document.querySelector("#search-form");
    const searchInput = document.querySelector("#search-input");
    const searchResultsContainer = document.querySelector("#search-results-container");
    const songDetailsContainer = document.querySelector("#song-details-container");

    // Event listener for clicking on a playlist
    playlistItems.forEach(item => {
        item.addEventListener("click", async function (event) {
            const playlistId = event.target.getAttribute("data-id");

            // Fetch playlist details via API
            const response = await fetch(`/api/playlists/${playlistId}`);
            const playlistData = await response.json();

            // Render the playlist details in the center column
            renderPlaylistDetails(playlistData);
        });
    });

    // Event listener for clicking on a song
    songItems.forEach(item => {
        item.addEventListener("click", async function (event) {
            const songId = event.target.getAttribute("data-id");

            // Fetch song details via API
            const response = await fetch(`/api/songs/${songId}`);
            const songData = await response.json();

            // Render the song details in the right column
            renderSongDetails(songData);
        });
    });

    // Event listener for search form submission
    searchForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const query = searchInput.value.trim();

        if (query) {
            // Fetch search results via API
            const response = await fetch(`/api/songs/search?query=${encodeURIComponent(query)}`);
            const searchResults = await response.json();

            // Render the search results in the center column
            renderSearchResults(searchResults);
        }
    });

    // Function to render playlist details
    function renderPlaylistDetails(playlistData) {
        const playlistContainer = document.querySelector("#playlist-container");
        playlistContainer.innerHTML = `
            <h2>${playlistData.name}</h2>
            <p>Total Songs: ${playlistData.songs.length}</p>
            <p>Total Runtime: ${calculateTotalRuntime(playlistData.songs)}</p>
            <ol>
                ${playlistData.songs.map(song => `
                    <li>
                        ${song.name} - ${song.artist} (${song.album})
                        <span class="duration">${song.duration} min</span>
                    </li>
                `).join('')}
            </ol>
        `;
    }

    // Function to render song details
    function renderSongDetails(songData) {
        songDetailsContainer.innerHTML = `
            <img src="${songData.albumImageUrl}" alt="${songData.albumName}" />
            <h3>${songData.songName}</h3>
            <p>Artist: ${songData.artistName}</p>
            <p>Album: ${songData.albumName}</p>
            <p>Date Released: ${songData.dateReleased}</p>
            <p>Duration: ${songData.trackDuration}</p>
            <p>Explicit: ${songData.explicit ? "Yes" : "No"}</p>
            <p><a href="${songData.trackUri}" target="_blank">Listen on Spotify</a></p>
        `;
    }

    // Function to render search results
    function renderSearchResults(searchResults) {
        searchResultsContainer.innerHTML = `
            ${searchResults.map(song => `
                <div class="song-item" data-id="${song.id}">
                    ${song.title} - ${song.artist} (${song.album})
                    <span class="duration">${song.duration} min</span>
                    <button class="add-to-playlist-btn" data-id="${song.id}">+</button>
                </div>
            `).join('')}
        `;
    }

    // Function to calculate total runtime of a playlist
    function calculateTotalRuntime(songs) {
        const totalMs = songs.reduce((total, song) => total + song.duration * 60000, 0);
        return (totalMs / 60000).toFixed(2) + " min";
    }
});
