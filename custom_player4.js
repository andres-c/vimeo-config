$(document).ready(function () {
  $('form#plyr-settings-form').on('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission
    event.stopImmediatePropagation(); // Stop the event from propagating further

// Initialize the Plyr player with default settings
	if (localStorage.getItem('plyrSettings')) {
		var setterss = JSON.parse(localStorage.getItem('plyrSettings'));
		var controls = setterss.newControls;
		var clickPlaySetting = setterss.clickToPlay;
	} else {
		controls = [
			'play-large',
			'play',
			'progress',
			'current-time',
			'mute',
			'volume',
			'captions',
			'settings',
			'fullscreen',
		];
		clickToPlaySetting = true;
	}

	// Retrieve the generated code from local storage if it exists
	const storedGeneratedCode = localStorage.getItem('generatedCode');
	if (storedGeneratedCode) {
		$('#generated-code').val(storedGeneratedCode);
	}

	const player = new Plyr('.js-player', {
		controls,
		muted: true,
		clickToPlay: clickPlaySetting,
		autoplay: true,
		loop: { active: true },
		hideControls: true,
		// fullscreen: { enabled: false },
		storage: { enabled: true, key: 'plyr' },
	});

	// Update the form with saved settings (if available)
	if (localStorage.getItem('plyrSettings')) {
		let savedSettings = JSON.parse(localStorage.getItem('plyrSettings'));
		$('#mute-checkbox').prop('checked', savedSettings.muted);
		$('#autoplay-checkbox').prop('checked', savedSettings.autoplay);
		$('#loop-checkbox').prop('checked', savedSettings.loop.active);
		$('#hide-controls-checkbox').prop('checked', savedSettings.hideControls);
		$('#click-to-play').prop('checked', savedSettings.clickToPlay);
		// $('#storage').prop('checked', savedSettings.storage.enabled);
		// $('#fullscreen-checkbox').prop('checked', savedSettings.fullscreen.enabled);
		$('#provider-select').val(savedSettings.provider);
		$('#video-id-input').val(savedSettings.videoId);

		//controls
		$('#control-play-large').prop('checked', savedSettings.playLarge);
		$('#control-play').prop('checked', savedSettings.play);
		$('#control-progress').prop('checked', savedSettings.progress);
		$('#control-current-time').prop('checked', savedSettings.time);
		$('#control-mute').prop('checked', savedSettings.mute);
		$('#control-volume').prop('checked', savedSettings.volume);
		$('#control-captions').prop('checked', savedSettings.captions);
		$('#control-settings').prop('checked', savedSettings.settings);
		$('#control-fullscreen').prop('checked', savedSettings.fullscreen);
	}

	// Retrieve the saved settings from local storage if they exist
	const savedSettings = localStorage.getItem('plyrSettings');
	// console.log(savedSettings);

	if (savedSettings) {
		let settings = JSON.parse(savedSettings);
		player.muted = settings.muted;
		player.autoplay = settings.autoplay;
		player.loop.active = settings.loop.active;
		player.hideControls = settings.hideControls;
		player.clickToPlay = settings.clickToPlay;
		// player.storage = settings.storage.enabled;
		// player.fullscreen.enabled = settings.fullscreen.enabled;
		player.controls = settings.newControls;

		if (settings.provider !== 'html5') {
			player.source = {
				type: 'video',
				sources: [
					{
						src: settings.videoId,
						provider: settings.provider,
					},
				],
			};
		} else if (settings.provider == 'html5') {
			player.source = {
				type: 'video',
				sources: [
					{
						src: settings.videoId,
						type: 'video/mp4',
					},
				],
			};
		}
	} else {
		// Set a default video source and provider
		player.source = {
			type: 'video',
			sources: [
				{
					src: '761709720',
					provider: 'vimeo',
				},
			],
		};
		$('#provider-select').val('vimeo');
		$('#video-id-input').val('761709720');
	}

	console.log(player);
	$('#update-btn').click(function () {
		console.log('Update button clicked!');

		// Initialize the controls array
		var newControls = [];

		// Get the new settings from the form
		var newSettings = {
			muted: $('#mute-checkbox').prop('checked'),
			autoplay: $('#autoplay-checkbox').prop('checked'),
			loop: { active: $('#loop-checkbox').prop('checked') },
			hideControls: $('#hide-controls-checkbox').prop('checked'),
			clickToPlay: $('#click-to-play').prop('checked'),
			provider: $('#provider-select').val(),
			videoId: $('#video-id-input').val(),

			//controls
			playLarge: $('#control-play-large').prop('checked'),
			play: $('#control-play').prop('checked'),
			progress: $('#control-progress').prop('checked'),
			time: $('#control-current-time').prop('checked'),
			mute: $('#control-mute').prop('checked'),
			volume: $('#control-volume').prop('checked'),
			captions: $('#control-captions').prop('checked'),
			settings: $('#control-settings').prop('checked'),
			fullscreen: $('#control-fullscreen').prop('checked'),
			newControls: newControls,
		};

		// Check each control setting and add to the array if true
		if (newSettings.playLarge) {
			newControls.push('play-large');
		}
		if (newSettings.play) {
			newControls.push('play');
		}
		if (newSettings.progress) {
			newControls.push('progress');
		}
		if (newSettings.time) {
			newControls.push('current-time');
		}
		if (newSettings.mute) {
			newControls.push('mute');
		}
		if (newSettings.volume) {
			newControls.push('volume');
		}
		if (newSettings.captions) {
			newControls.push('captions');
		}
		if (newSettings.settings) {
			newControls.push('settings');
		}
		if (newSettings.fullscreen) {
			newControls.push('fullscreen');
		}

		// Update the Plyr player settings and save them to local storage
		player.muted = newSettings.muted;
		player.autoplay = newSettings.autoplay;
		player.loop.active = newSettings.loop.active;
		player.hideControls = newSettings.hideControls;
		player.clickToPlay = newSettings.clickToPlay;
		player.controls = newSettings.newControls;

		// Create an object with applicable Plyr settings
		const plyrSettings = {
			muted: newSettings.muted,
			autoplay: newSettings.autoplay,
			loop: newSettings.loop,
			hideControls: newSettings.hideControls,
			clickToPlay: newSettings.clickToPlay,
			controls: newSettings.newControls,
		};

    player.source = {
      type: 'video',
      sources: [
        {
          src: newSettings.videoId,
          provider: 'vimeo',
        },
      ],
    };

		// Create a new object called playerOptions with only the necessary properties from newSettings
		const playerOptions = {
			controls: newSettings.newControls,
			muted: newSettings.muted,
			autoplay: newSettings.autoplay,
			loop: { active: newSettings.loop.active },
			hideControls: newSettings.hideControls,
			clickToPlay: newSettings.clickToPlay,
		};

		// Generate the custom HTML and JS code
		var generatedCode = `
    <!-- Plyr.io CDN CSS -->
    <link rel="stylesheet" href="https://cdn.plyr.io/3.7.3/plyr.css" />

    <!-- Plyr.io CDN JS -->
    <script src="https://cdn.plyr.io/3.7.3/plyr.polyfilled.js"></script>

    <!-- Your custom Plyr settings -->
    <script>
    document.addEventListener("DOMContentLoaded", function () {
        const playerOptions = ${JSON.stringify(playerOptions)};
        const player = new Plyr('.js-player', playerOptions);
    });
    </script>

    <!-- Plyr video element -->
    <div id="player" class="js-player" data-plyr-provider="vimeo" data-plyr-embed-id="${
			newSettings.videoId
		}"></div>
    `;

		// Update the textarea with the generated code
		$('#generated-code').val(generatedCode.trim());

		// Save the generated code to local storage
		localStorage.setItem('generatedCode', generatedCode.trim());

		localStorage.setItem('plyrSettings', JSON.stringify(newSettings));
		console.log('Player settings updated and saved!');
		player.restart();
	});    
  });
});
