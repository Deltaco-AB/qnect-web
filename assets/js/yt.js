// -- Load YouTube videos from YouTube iFrame API --

// Player element id's and YT video id's
const videos = {
	"yt_slide_plug": "vNkDlYGGk-8",
	"yt_slide_lights": "FOG22gBpnEQ",
	"yt_slide_security": "y7nPklO8hbc",
	"yt_page_plug": "vNkDlYGGk-8",
	"yt_page_lights": "FOG22gBpnEQ",
	"yt_page_security": "y7nPklO8hbc"
}

// Fetch and load the API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let players = [];

function loadYouTubeFrame(target,videoId) {
	const options = {
		height: "100%",
		width: "100%",
		videoId: videoId,
		playerVars: {
			"playsinline": 1
		}
	};
	const player = new YT.Player(target,options)
	players.push(player);
}

// Callback from YT API when the script is loaded
function onYouTubeIframeAPIReady() {
	for(const [target,videoId] of Object.entries(videos)) {
		loadYouTubeFrame(target,videoId);
	}
}