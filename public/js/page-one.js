document.addEventListener("DOMContentLoaded", function () {
  const playlistContainer = document.querySelector("#playlist-column");
  const searchButton = document.querySelector("#search-button");
  const searchInput = document.querySelector("#song-search");
  const searchResultsContainer = document.querySelector("#song-list");
  const songDetailsContainer = document.querySelector("#song-details-column");
  const createPlaylistForm = document.querySelector(".create-playlist-form");
  const modal = document.querySelector("#myModal");
  const addSongToPlaylistModal = document.getElementById('addToPlaylistModal');
  const selectedSongInput = document.getElementById('selected-song-id');

  // Debounce function to limit the rate of search requests
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Fetch data from the API
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

  // Event delegation for playlist and song actions
  document.body.addEventListener("click", async function (event) {
    const target = event.target;

    if (target.matches(".list-group-item")) {
      event.preventDefault();
      const playlistId = target.getAttribute("data-playlist-id");
      const playlistData = await fetchData(`/api/playlists/${playlistId}`);
      renderPlaylistDetails(playlistData);
    } else if (target.matches(".song-title")) {
      event.preventDefault();
      const songId = target.getAttribute("data-song-id");
      const songData = await fetchData(`/api/songData/${songId}`);
      renderSongDetails(songData);
    } else if (target.matches(".add-to-playlist-btn")) {
      event.preventDefault();
      const songId = target.getAttribute("data-song-id");
      selectedSongInput.value = songId;
      $('#addToPlaylistModal').modal('show');
    } else if (target.matches(".delete-playlist-btn")) {
      event.preventDefault();
      const playlistId = target.getAttribute("data-playlist-id");
      handleDeletePlaylist(playlistId);
    }
  });

  // Debounced search
  const handleSearch = debounce(async function (query) {
    if (query) {
      searchResultsContainer.innerHTML = "<p>Loading...</p>";
      const searchResults = await fetchData(`/pageOne/search?query=${encodeURIComponent(query)}`);
      renderSearchResults(searchResults.songs);
    }
  }, 300);

  searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    const query = searchInput.value.trim();
    handleSearch(query);
  });

  // Create playlist handler
  if (createPlaylistForm) {
    createPlaylistForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const title = document.getElementById("playlist-title").value;
      const description = document.getElementById("description").value;

      if (!title) {
        alert("Please fill out the playlist title.");
        return;
      }

      try {
        const response = await fetch("/api/playlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description })
        });

        if (response.ok) {
          const newPlaylist = await response.json();
          renderNewPlaylist(newPlaylist);
          modal.style.display = "none";
          clearModalBackdrop();
        } else {
          alert("Failed to create playlist.");
        }
      } catch (error) {
        console.error("Error creating playlist:", error);
        alert("Failed to create playlist. Please try again later.");
      }
    });
  } else {
    console.error("Create playlist form not found");
  }

  // Render new playlist
  function renderNewPlaylist(playlist) {
    // Ensure playlist and its properties exist
    if (!playlist || !playlist.id || !playlist.title) {
      console.error('Invalid playlist data:', playlist);
      return;
    }
  
    // Create a new playlist item element
    const newPlaylistItem = document.createElement("li");
    newPlaylistItem.className = "list-group-item bg-dark text-white d-flex justify-content-between align-items-center";
    newPlaylistItem.dataset.playlistId = playlist.id;
    
    // Use playlist.title and other properties
    newPlaylistItem.innerHTML = `
      ${playlist.title}
      <button class="btn btn-danger btn-sm delete-playlist-btn" data-playlist-id="${playlist.id}">X</button>
    `;
    
    // Append the new playlist item to the playlist container
    const playlistList = playlistContainer.querySelector(".list-group");
    if (playlistList) {
      playlistList.appendChild(newPlaylistItem);
    } else {
      console.error('Playlist list container not found');
    }
  }
  

// Function to render playlist details
function renderPlaylistDetails(playlist) {
  // Ensure playlist and its properties exist
  if (!playlist || !playlist.title || !playlist.songs || !Array.isArray(playlist.songs)) {
    console.error('Invalid playlist data:', playlist);
    return;
  }

  // Generate HTML content for playlist details
  const html = `
    <div class="playlist-details">
      <h5>${playlist.title}</h5>
      <p>Description: ${playlist.description || 'No description available'}</p>
      <ul class="song-list">
        ${playlist.songs.length > 0
          ? playlist.songs.map(song => {
              // Debugging log to check song data
              console.log('Song data:', song);

              // Extracting title and artist from arrays
              const title = (song.track_name && song.track_name.length > 0) ? song.track_name[0] : "Unknown Title";
              const artist = (song.artist_name && song.artist_name.length > 0) ? song.artist_name[0] : "Unknown Artist";

              return `
                <li class="song-item">
                  <strong>${title}</strong> - ${artist}
                  ${song.album_name ? ` | <em>${song.album_name}</em>` : ''}
                  ${song.album_release_date ? ` | Released: ${song.album_release_date}` : ''}
                  ${song.track_duration_ms ? ` | Duration: ${(parseInt(song.track_duration_ms) / 60000).toFixed(2)} mins` : ''}
                </li>
              `;
            }).join("")
          : '<li>No songs available</li>'
        }
      </ul>
    </div>
  `;

  // Update the song details container
  songDetailsContainer.innerHTML = html;
}

// Function to render song details
function renderSongDetails(songData) {
  if (!songData) return;

  // Extracting the first element from arrays
  const trackName = songData.track_name ? songData.track_name[0] : "Unknown Title";
  const artistName = songData.artist_name ? songData.artist_name[0] : "Unknown Artist";
  const albumName = songData.album_name || "Unknown Album";
  const releaseDate = songData.album_release_date || "Unknown Release Date";
  const durationMs = songData.track_duration_ms || "Unknown Duration";
  const duration = durationMs !== "Unknown Duration" ? (parseInt(durationMs) / 60000).toFixed(2) : "Unknown Duration"; // converting ms to minutes
  const explicit = songData.explicit ? "Yes" : "No";
  const albumImageUrl = songData.album_image_url || "default_image.jpg";
  const trackUri = songData.track_uri || "#";

  // Generate HTML content
  const html = `
    <img src="${albumImageUrl}" alt="${albumName}" style="max-width: 100%; height: auto;" />
    <h3 id="song-details-heading">${trackName}</h3>
    <p>Artist: ${artistName}</p>
    <p>Album: ${albumName}</p>
    <p>Date Released: ${releaseDate}</p>
    <p>Duration: ${duration} mins</p>
    <p>Explicit: ${explicit}</p>
    <p><a href="${trackUri}" target="_blank">Listen on Spotify</a></p>
  `;

  // Update the song details container
  songDetailsContainer.innerHTML = html;
  songDetailsContainer.setAttribute("role", "region");
  songDetailsContainer.setAttribute("aria-labelledby", "song-details-heading");
}


  // Render search results
  function renderSearchResults(songs) {
    const html = songs.map(song => `
      <div class="song-item row">
        <div class="col-9">
          <h5>
            <a href="javascript:void(0);" class="song-title" data-song-id="${song.id}">
              ${song.title} - ${song.artist}
            </a>
          </h5>
          <p>${song.album} | Released: ${song.dateReleased} | Duration: ${song.duration} mins</p>
        </div>
        <div class="col-3 text-end">
          <button class="btn btn-outline-light add-to-playlist-btn" data-song-id="${song.id}">
            <i class="fas fa-plus"></i> Add to Playlist
          </button>
        </div>
      </div>
    `).join("");
    searchResultsContainer.innerHTML = html;
  }

  // Delete playlist
  async function handleDeletePlaylist(playlistId) {
    console.log('Attempting to delete playlist with ID:', playlistId);
    if (confirm("Are you sure you want to delete this playlist?")) {
      try {
        const response = await fetch(`/api/playlists/${playlistId}`, { method: "DELETE" });
        if (response.ok) {
          document.querySelector(`[data-playlist-id="${playlistId}"]`).remove();
        } else {
          alert("Failed to delete playlist.");
        }
      } catch (error) {
        console.error("Error deleting playlist:", error);
        alert("Failed to delete playlist. Please try again later.");
      }
    }
  }
  

  // Handle form submission for adding song to playlist
document.getElementById('add-song-to-playlist-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  // Get the values from the form
  const playlistId = document.getElementById('select-playlist').value;
  const songId = document.getElementById('selected-song-id').value; // Assuming you have an input field for song ID

  // Debugging logs
  console.log('Playlist ID:', playlistId);
  console.log('Song ID:', songId);

  // Simple client-side validation
  if (!playlistId || !songId) {
    alert("Please provide all necessary details.");
    return;
  }

  try {
    // Send POST request to add song to playlist
    const response = await fetch(`/api/playlists/${playlistId}/add-song`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        songId: songId
      }),
    });

    // Debugging logs for response
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    if (response.ok) {
      // Successfully added song to playlist
      console.log('Song added to playlist successfully');
      const data = await response.json();
      console.log('Song added to playlist:', data);

      // Hide the modal
      $('#addToPlaylistModal').modal('hide');
    } else {
      // Server-side error handling
      const errorData = await response.json();
      console.error('Server Error:', errorData);
      alert(`Failed to add song to playlist: ${errorData.error || 'Unknown error'}`);
    }
  } catch (error) {
    // Network or other unexpected errors
    console.error('Network Error:', error);
    alert("Failed to add song to playlist. Please try again later.");
  }
});


  // Clear modal backdrop after closing modal
  function clearModalBackdrop() {
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.parentNode.removeChild(backdrop);
    }
    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = "";
  }

  // Intro.js for tour
  const startTourBtn = document.getElementById("start-tour-btn");
  if (startTourBtn) {
    startTourBtn.addEventListener("click", function () {
      introJs()
        .setOptions({
          steps: [
            { intro: "Welcome to the Music App! Let's take a quick tour." },
            { element: "#playlist-column", intro: "Here are your playlists." },
            { element: "#songs-column", intro: "Search and add songs to your playlists here." },
            { element: "#song-details-column", intro: "View song details here." }
          ],
          showStepNumbers: true,
          showBullets: false,
          exitOnOverlayClick: true,
          overlayOpacity: 0.8,
          scrollToElement: true,
        })
        .start();
    });
  } else {
    console.error('Start tour button not found');
  }

  console.log("JavaScript loaded");
});
