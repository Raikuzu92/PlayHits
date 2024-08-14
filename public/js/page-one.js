document.addEventListener("DOMContentLoaded", function () {
  // Select DOM elements
  const playlistContainer = document.querySelector("#playlist-container");
  const searchButton = document.querySelector("#search-button");
  const searchInput = document.querySelector("#song-search");
  const searchResultsContainer = document.querySelector("#song-list");
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

      const responseData = await response.json();
      return responseData; // Return the parsed JSON object
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to load data. Please try again later.");
    }
  }

  // Event delegation for playlist and song items
  document.body.addEventListener("click", async function (event) {
    if (event.target.matches(".playlist-item")) {
      event.preventDefault();
      const playlistId = event.target.getAttribute("data-id");
      const playlistData = await fetchData(`/api/playlists/${playlistId}`);
      renderPlaylistDetails(playlistData);
    } else if (event.target.matches(".song-title")) {
      event.preventDefault();
      const songId = event.target.getAttribute("data-id");
      const songData = await fetchData(`/api/songData/${songId}`);
      renderSongDetails(songData);
    } else if (event.target.matches(".add-to-playlist-btn")) {
      event.preventDefault();
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
      renderSearchResults(searchResults.songs);
    }
  }, 300);

  searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    const query = searchInput.value.trim();
    handleSearch(query);
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
            <img src="${songData.album_image_url}" alt="${
      songData.album_name
    }" />
            <h3 id="song-details-heading">${songData.track_name}</h3>
            <p>Artist: ${songData.album_artist_name}</p>
            <p>Album: ${songData.album_name}</p>
            <p>Date Released: ${songData.album_release_date}</p>
            <p>Duration: ${songData.track_duration_ms}</p>
            <p>Explicit: ${songData.explicit ? "Yes" : "No"}</p>
            <p><a href="${
              songData.track_uri
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
    const searchResultsContainer = document.getElementById("song-list");
    searchResultsContainer.innerHTML = ""; // Clear any existing content

    const html = searchResults
      .map(
        (song) => `
            <div class="song-item row" data-id="${song.id}">
                <div class="col-9">
                    <h5>
                        <a href="javascript:void(0);" class="song-title" data-song-id="${
                          song.id
                        }">
                            ${song.title} - ${song.artist.join(", ")}
                        </a>
                    </h5>
                    <p>${song.album} | Released: ${
          song.dateReleased
        } | Duration: ${song.duration} mins</p>
                </div>
                <div class="col-3 text-end">
                    <button class="btn btn-outline-light add-to-playlist-btn" data-song-id="${
                      song.id
                    }">
                        <i class="fas fa-plus"></i> Add to Playlist
                    </button>
                </div>
            </div>
        `
      )
      .join("");

    searchResultsContainer.innerHTML = html;
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
