document.addEventListener("DOMContentLoaded", function () {
  // Select DOM elements
  const playlistContainer = document.querySelector("#playlist-container");
  const searchInput = document.querySelector("#search-button");
  const searchResultsContainer = document.querySelector(
    "#search-results-container"
  );
  const songDetailsContainer = document.querySelector(
    "#song-details-container"
  );

  // Debounce function to delay API calls
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Generic function to fetch data from the API with error handling
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to load data. Please try again later.");
    }
  }

  // Event delegation for playlist and song items
  document.body.addEventListener("click", async function (event) {
    if (event.target.matches(".playlist-item")) {
      const playlistId = event.target.getAttribute("data-id");
      const playlistData = await fetchData(`/api/playlists/${playlistId}`);
      renderPlaylistDetails(playlistData);
    } else if (event.target.matches(".song-item")) {
      const songId = event.target.getAttribute("data-id");
      const songData = await fetchData(`/api/songs/${songId}`);
      renderSongDetails(songData);
    } else if (event.target.matches(".add-to-playlist-btn")) {
      const songId = event.target.getAttribute("data-id");
      // Handle adding the song to a playlist
    }
  });

  // Event listener for search form submission with debounce
  const handleSearch = debounce(async function (query) {
    if (query) {
      searchResultsContainer.innerHTML = "<p>Loading...</p>"; // Show loading indicator
      const searchResults = await fetchData(
        `/pageOne/search?query=${encodeURIComponent(query)}`
      );
      renderSearchResults(searchResults);
    }
  }, 300);

  searchInput.addEventListener("click", function (event) {
    handleSearch(event.target.value.trim());
  });

  // Function to render playlist details
  function renderPlaylistDetails(playlistData) {
    if (!playlistData) return;
    playlistContainer.innerHTML = `
            <h2 id="playlist-heading">${playlistData.name}</h2>
            <p>Total Songs: ${playlistData.songs.length}</p>
            <p>Total Runtime: ${calculateTotalRuntime(playlistData.songs)}</p>
            <ol>
                ${playlistData.songs
                  .map(
                    (song) => `
                    <li>
                        ${song.name} - ${song.artist} (${song.album})
                        <span class="duration">${song.duration} min</span>
                    </li>
                `
                  )
                  .join("")}
            </ol>
        `;
    playlistContainer.setAttribute("role", "region");
    playlistContainer.setAttribute("aria-labelledby", "playlist-heading");
  }

  // Function to render song details
  function renderSongDetails(songData) {
    if (!songData) return;
    songDetailsContainer.innerHTML = `
            <img src="${songData.albumImageUrl}" alt="${songData.albumName}" />
            <h3 id="song-details-heading">${songData.songName}</h3>
            <p>Artist: ${songData.artistName}</p>
            <p>Album: ${songData.albumName}</p>
            <p>Date Released: ${songData.dateReleased}</p>
            <p>Duration: ${songData.trackDuration}</p>
            <p>Explicit: ${songData.explicit ? "Yes" : "No"}</p>
            <p><a href="${
              songData.trackUri
            }" target="_blank">Listen on Spotify</a></p>
        `;
    songDetailsContainer.setAttribute("role", "region");
    songDetailsContainer.setAttribute(
      "aria-labelledby",
      "song-details-heading"
    );
  }

  // Function to render search results
  function renderSearchResults(searchResults) {
    if (!searchResults) return;
    searchResultsContainer.innerHTML = `
            ${searchResults
              .map(
                (song) => `
                <div class="song-item" data-id="${song.id}" tabindex="0" role="listitem">
                    ${song.title} - ${song.artist} (${song.album})
                    <span class="duration">${song.duration} min</span>
                    <button class="add-to-playlist-btn" data-id="${song.id}">+</button>
                </div>
            `
              )
              .join("")}
        `;
    searchResultsContainer.setAttribute("role", "list");
  }

  // Function to calculate total runtime of a playlist
  function calculateTotalRuntime(songs) {
    const totalMs = songs.reduce(
      (total, song) => total + song.duration * 60000,
      0
    );
    return (totalMs / 60000).toFixed(2) + " min";
  }

  // Trigger Intro.js on page load
  introJs()
    .setOptions({
      steps: [
        {
          element: "#playlist-column",
          intro:
            "Here are your playlists. You can view and manage them from this section.",
        },
        {
          element: "#song-search",
          intro: "Use this search bar to find songs quickly.",
        },
        {
          element: "#song-list",
          intro:
            "Here are some popular songs. You can add them to your playlists.",
        },
        {
          element: "#song-details-column",
          intro: "This section will show the details of the selected song.",
        },
      ],
      showProgress: true,
    })
    .start();
});
