const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const recordingsContainer = document.getElementById('recordings-container');
const liveWaveformContainer = document.getElementById('live-waveform');

let mediaRecorder;
let audioChunks = [];
let liveWaveform;

function initializeLiveWaveform() {
  liveWaveformContainer.innerHTML = '';
  liveWaveform = WaveSurfer.create({
    container: liveWaveformContainer,
    waveColor: 'lime',
    progressColor: 'green',
    responsive: true,
  });
}


startBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('Microphone access granted');

    // Initialize WaveSurfer for live visualization
    initializeLiveWaveform();

    // Create a MediaRecorder instance
    mediaRecorder = new MediaRecorder(stream);

    // Collect audio data as chunks
    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    // Handle the stop event
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioURL = URL.createObjectURL(audioBlob);

      // Create a waveform visualization for the recorded audio
      createWaveform(audioBlob);

      // Create audio element for playback
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = audioURL;
      recordingsContainer.appendChild(audio);

      // Clear the chunks
      audioChunks = [];
    };

    // Start recording
    mediaRecorder.start();
    console.log('Recording started...');
  } catch (err) {
    console.error('Error accessing microphone:', err);
    alert(`Error accessing microphone: ${err.message}`);
  }
});


stopBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    console.log('Recording stopped.');
  } else {
    console.warn('No active recording to stop.');
  }
});

const waveformContainer = document.getElementById('waveform-container');

function createWaveform(audioBlob) {
  const wave = WaveSurfer.create({
    container: waveformContainer,
    waveColor: 'violet',
    progressColor: 'purple',
    responsive: true,
  });

  // Convert Blob to Object URL and load into WaveSurfer
  const audioURL = URL.createObjectURL(audioBlob);
  wave.load(audioURL);

  // Clean up old waveform if any
  waveformContainer.innerHTML = '';
  return wave;
}

// Modify the onstop handler to include visualization
mediaRecorder.onstop = () => {
  const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  const audioURL = URL.createObjectURL(audioBlob);

  // Create waveform visualization
  createWaveform(audioBlob);

  // Add audio element for playback
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.src = audioURL;
  recordingsContainer.appendChild(audio);

  audioChunks = [];
};

function createWaveform(audioBlob) {
  const waveformContainer = document.createElement('div');
  recordingsContainer.appendChild(waveformContainer);

  const wave = WaveSurfer.create({
    container: waveformContainer,
    waveColor: 'violet',
    progressColor: 'purple',
    responsive: true,
  });

  const audioURL = URL.createObjectURL(audioBlob);
  wave.load(audioURL);
}