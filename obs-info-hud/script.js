const obs = new OBSWebSocket();

// 1. Get URL Parameters
const params = new URLSearchParams(window.location.search);
const host = params.get('host') || '127.0.0.1';
const port = params.get('port') || '4455';
const password = params.get('password');

const container = document.getElementById('border-container');
const streamText = document.getElementById('stream-timer');
const recordText = document.getElementById('record-timer');

// 2. Connect to OBS
async function connectOBS() {
    try {
        await obs.connect(`ws://${host}:${port}`, password);
        console.log("Connected to OBS");
        
        // Initial state check
        const status = await obs.call('GetStreamStatus');
        const recStatus = await obs.call('GetRecordStatus');
        updateUI(status.outputActive, recStatus.outputActive);
    } catch (error) {
        console.error("Connection Failed", error);
    }
}

// 3. Update Border Logic
function updateUI(isStreaming, isRecording) {
    container.classList.toggle('streaming', isStreaming);
    container.classList.toggle('recording', isRecording);
}

// 4. Listen for Events
obs.on('StreamStateChanged', data => {
    updateUI(data.outputActive, container.classList.contains('recording'));
});

obs.on('RecordStateChanged', data => {
    updateUI(container.classList.contains('streaming'), data.outputActive);
});

// 5. Timer Logic
setInterval(async () => {
    if (obs.socket) {
        const stream = await obs.call('GetStreamStatus');
        const record = await obs.call('GetRecordStatus');

        if (stream.outputActive) {
            streamText.innerText = `Stream: ${stream.outputTimecode.split('.')[0]}`;
        }
        if (record.outputActive) {
            recordText.innerText = `Record: ${record.outputTimecode.split('.')[0]}`;
        }
    }
}, 1000);

connectOBS();