// -- Load YouTube videos from YouTube iFrame API --

// Player element id's and YT video id's
const videos = {
	"yt_slide0": "dQw4w9WgXcQ",
	"yt_slide1": "dQw4w9WgXcQ",
	"yt_slide2": "dQw4w9WgXcQ",
	"yt_page0": "dQw4w9WgXcQ",
	"yt_page1": "dQw4w9WgXcQ",
	"yt_page2": "dQw4w9WgXcQ"
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