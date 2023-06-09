document.addEventListener('DOMContentLoaded', function () {
  loadSettings();

  document.getElementById('plyr-settings-form').addEventListener('submit', function (event) {
    event.preventDefault();
    saveSettings();
    updatePlayer();
  });
});

function saveSettings() {
  const settings = {
    videoId: document.getElementById('video-id').value,
    mute: document.getElementById('mute-checkbox').checked,
    clickToPlay: document.getElementById('click-to-play').checked,
    autoplay: document.getElementById('autoplay-checkbox').checked,
    loop: document.getElementById('loop-checkbox').checked,
    storage: document.getElementById('storage').checked,
    controls: Array.from(document.querySelectorAll('[name="controls"]:checked')).map(checkbox => checkbox.value),
  };
  localStorage.setItem('plyrSettings', JSON.stringify(settings));
}

function loadSettings() {
  const storedSettings = localStorage.getItem('plyrSettings');
  if (storedSettings) {
    const settings = JSON.parse(storedSettings);
    document.getElementById('video-id').value = settings.videoId;
    document.getElementById('mute-checkbox').checked = settings.mute;
    document.getElementById('click-to-play').checked = settings.clickToPlay;
    document.getElementById('autoplay-checkbox').checked = settings.autoplay;
    document.getElementById('loop-checkbox').checked = settings.loop;
    document.getElementById('storage').checked = settings.storage;
    settings.controls.forEach(control => {
      document.querySelector(`[name="controls"][value="${control}"]`).checked = true;
    });
  }
}

function updatePlayer() {
  // Get form values
  const videoId = document.getElementById("video-id").value;
  const muteCheckbox = document.getElementById("mute-checkbox");
  const clickToPlay = document.getElementById("click-to-play");
  const autoplayCheckbox = document.getElementById("autoplay-checkbox");
  const loopCheckbox = document.getElementById("loop-checkbox");
  const storage = document.getElementById("storage");

  // Collect control elements
  const controlElements = document.querySelectorAll('[name="controls"]');
  let controlSettings = [];

  controlElements.forEach(element => {
    if (element.checked) {
      controlSettings.push(element.value);
    }
  });

  // Plyr player settings
  const playerSettings = {
    vimeo: {
      byline: false,
      portrait: false,
      title: false,
      speed: true,
      transparent: false,
    },
    controls: controlSettings,
    muted: muteCheckbox.checked,
    clickToPlay: clickToPlay.checked,
    autoplay: autoplayCheckbox.checked,
    loop: { active: loopCheckbox.checked },
    storage: { enabled: storage.checked },
  };

  // Destroy previous player instance if exists
  if (player) {
    player.destroy();
  }

  // Create and setup the Plyr player
  player = new Plyr("#video-container", playerSettings);
  player.source = {
    type: "video",
    sources: [
      {
        src: videoId,
        provider: "vimeo",
      },
    ],
  };

  // Store the current time of the video
  if (storage.checked) {
    player.on("timeupdate", function () {
      localStorage.setItem("plyr-video-current-time", player.currentTime);
    });
  }
}

// Trigger updatePlayer on form submission
document.getElementById("plyr-settings-form").addEventListener("submit", function (e) {
  e.preventDefault();
  updatePlayer();
});

// Load the video with the stored current time if available
window.addEventListener("DOMContentLoaded", function () {
  const storedTime = parseFloat(localStorage.getItem("plyr-video-current-time"));
  if (storedTime) {
    player.on("ready", function () {
      player.currentTime = storedTime;
    });
  }
  updatePlayer();
});


function generateCode() {
  const videoId = document.getElementById("video-id").value;
  const muteCheckbox = document.getElementById("mute-checkbox");
  const clickToPlay = document.getElementById("click-to-play");
  const autoplayCheckbox = document.getElementById("autoplay-checkbox");
  const loopCheckbox = document.getElementById("loop-checkbox");
  const storage = document.getElementById("storage");

  const controlElements = document.querySelectorAll('[name="controls"]');
  let controlSettings = [];

  controlElements.forEach(element => {
    if (element.checked) {
      controlSettings.push(element.value);
    }
  });

  const playerSettings = {
    muted: muteCheckbox.checked ? "muted" : "",
    clickToPlay: clickToPlay.checked ? "data-plyr-clicktoplay" : "",
    autoplay: autoplayCheckbox.checked ? "autoplay" : "",
    loop: loopCheckbox.checked ? "loop" : "",
    storage: storage.checked ? "data-plyr-storage" : "",
    controls: controlSettings.join(","),
  };

  const embedCode = `
    <div id="video-container" data-plyr-provider="vimeo" data-plyr-embed-id="${videoId}" ${playerSettings.muted} ${playerSettings.clickToPlay} ${playerSettings.autoplay} ${playerSettings.loop} ${playerSettings.storage} data-plyr-controls="${playerSettings.controls}"></div>
    <script src="https://cdn.plyr.io/3.6.8/plyr.js"></script>
    <script>
      const player = new Plyr('#video-container');
    </script>
  `;

  return embedCode;
}

// Use the generateCode function when needed
const embedCode = generateCode();
console.log(embedCode);
