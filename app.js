// Module switcher
document.querySelectorAll('#modules button').forEach(b => b.onclick = () => {
  document.querySelectorAll('#modules button').forEach(x => x.classList.toggle('on', x === b));
  document.querySelectorAll('.module').forEach(s => s.classList.toggle('on', s.id === b.dataset.m));
});

// Record + playback
const recBtn = document.getElementById('rec');
const statusEl = document.getElementById('status');
const takes = document.getElementById('takes');
const ctx = new (window.AudioContext || window.webkitAudioContext)();
let recorder, chunks = [], n = 0;

async function addTake(blob) {
  const url = URL.createObjectURL(blob);
  const li = document.createElement('li');
  const canvas = document.createElement('canvas');
  const audio = Object.assign(document.createElement('audio'), { src: url, controls: true });
  li.append(`Take ${++n}`, canvas, audio);
  takes.prepend(li);
  try {
    const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
    drawWave(canvas, buf.getChannelData(0));
  } catch { /* waveform is optional */ }
}

function drawWave(canvas, data) {
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
  const g = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  g.fillStyle = '#c2185b';
  const step = Math.max(1, Math.floor(data.length / w));
  for (let x = 0; x < w; x++) {
    let max = 0;
    for (let i = 0; i < step; i++) max = Math.max(max, Math.abs(data[x * step + i] || 0));
    g.fillRect(x, (h - max * h) / 2, 1, Math.max(1, max * h));
  }
}

recBtn.onclick = async () => {
  if (recorder && recorder.state === 'recording') return recorder.stop();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);
    chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      recBtn.classList.remove('live'); recBtn.textContent = '● Record'; statusEl.textContent = 'Ready';
      addTake(new Blob(chunks, { type: recorder.mimeType }));
    };
    recorder.start();
    recBtn.classList.add('live'); recBtn.textContent = '■ Stop'; statusEl.textContent = 'Recording…';
  } catch (e) { statusEl.textContent = 'Mic blocked: ' + e.message; }
};
