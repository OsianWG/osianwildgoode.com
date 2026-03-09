let ws;
let activeTab = 'all';

function openTab(platform) {
    activeTab = platform;
    
    // 1. Update active button visual state
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        // Match button text to platform name
        if(btn.innerText.toLowerCase() === platform) btn.classList.add('active');
        if(platform === 'all' && btn.innerText === 'All') btn.classList.add('active');
    });

    // 2. Toggle YouTube specific fields ONLY for the YouTube tab
    const ytFields = document.getElementById('youtube-only-fields');
    if (platform === 'youtube') {
        ytFields.classList.remove('hidden');
    } else {
        ytFields.classList.add('hidden');
    }

    // 3. Change accent color based on platform
    const colors = { 
        all: '#9146ff', 
        twitch: '#9146ff', 
        youtube: '#ff0000', 
        kick: '#53fc18' 
    };
    document.documentElement.style.setProperty('--accent', colors[platform]);
}

function connectWS() {
    ws = new WebSocket('ws://127.0.0.1:8080/');

    ws.onopen = () => {
        document.getElementById('connection-status').innerText = 'Connected';
        document.getElementById('connection-status').className = 'status-online';
        
        // Automatically ask for YouTube info when we connect
        fetchYouTubeDefaults();
    };

    // THIS IS THE NEW PART: Listening for the response
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Check if this is the data we asked for
        if (data.status === "ok" && data.id === "get-yt-info") {
            const description = data.args.broadcast.description;
            if (description) {
                document.getElementById('stream-description').value = description;
                console.log("YouTube Description Loaded!");
            }
        }
    };
}

function fetchYouTubeDefaults() {
    const request = {
        "request": "GetBroadcast", // This tells Streamer.bot to look up the live broadcast
        "id": "get-yt-info"
    };
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(request));
}

// Function to "Unlock" the YouTube fields
function unlockYoutube() {
    document.getElementById('yt-status-warning').classList.add('hidden');
    document.getElementById('yt-inputs').classList.remove('hidden');
}

function openTab(platform) {
    activeTab = platform;
    
    // Update active button visual state
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase() === platform) btn.classList.add('active');
        if(platform === 'all' && btn.innerText === 'All') btn.classList.add('active');
    });

    const ytFields = document.getElementById('youtube-only-fields');
    
    if (platform === 'youtube') {
        ytFields.classList.remove('hidden');
        // Reset YouTube fields to "Locked" state whenever the tab is opened
        document.getElementById('yt-status-warning').classList.remove('hidden');
        document.getElementById('yt-inputs').classList.add('hidden');
    } else {
        ytFields.classList.add('hidden');
    }

    // Set accent colors
    const colors = { all: '#9146ff', twitch: '#9146ff', youtube: '#ff0000', kick: '#53fc18' };
    document.documentElement.style.setProperty('--accent', colors[platform]);
}

document.getElementById('update-btn').onclick = () => {
    const payload = {
        "request": "ExecuteAction",
        "id": "multistream-update",
        "actionName": "Update All Titles",
        "args": {
            "targetPlatform": activeTab,
            "newTitle": document.getElementById('stream-title').value,
            "newGame": document.getElementById('stream-game').value,
            "newTags": document.getElementById('stream-tags').value,
            // These will be sent as empty strings if the fields are hidden
            "ytDesc": document.getElementById('stream-description').value,
            "ytVis": document.getElementById('stream-visibility').value
        }
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
        alert(`Information sent for ${activeTab.toUpperCase()}!`);
    } else {
        alert("Streamer.bot is not connected. Check your WebSocket settings!");
    }
};