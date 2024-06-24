let osc, fft, reverb, delay;
let reverbOn = true;
let delayOn = true;
let oscOn = false;
let bgColor;
let baseFreq = 440;
let baseAmp = 0.5;
let volume = 0.5; // Initial volume

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvasContainer");

  userStartAudio().then(() => {
    osc = new p5.Oscillator("sine");
    osc.start();
    osc.amp(0); // Initialize with zero amplitude

    fft = new p5.FFT();

    reverb = new p5.Reverb();
    reverb.process(osc, 3, 2);

    delay = new p5.Delay();
    delay.process(osc, 0.12, 0.7, 2300);
  });

  bgColor = color(0, 0, 0);
  updateControlsText();
}

function draw() {
  background(bgColor);

  if (oscOn) {
    drawVisualMode();
  }
}

function drawVisualMode() {
  const freq = map(mouseX, 0, width, 100, 500) + parseFloat(baseFreq);
  const amp = map(mouseY, 0, height, 1, 0) * parseFloat(baseAmp);

  if (osc) {
    osc.freq(freq);
    osc.amp(amp * volume);
  }

  const colorRatio = map(freq, 100, 500, 0, 255);
  bgColor = color(colorRatio, 100, 255 - colorRatio);

  const waveform = fft.waveform();
  noFill();
  stroke(255 - colorRatio, colorRatio, 100);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    const x = map(i, 0, waveform.length, 0, width);
    const y = map(waveform[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();

  updateInfoText(freq, amp);
}

function mousePressed() {
  if (oscOn && osc) {
    osc.amp(0.5 * volume, 0.05); // Apply volume multiplier
  }
}

function mouseReleased() {
  if (oscOn && osc) {
    osc.amp(0, 0.5);
  }
}

function keyPressed() {
  switch (key.toUpperCase()) {
    case "M":
      toggleOscillator();
      break;
    case "A":
      setOscType("sine");
      break;
    case "S":
      setOscType("triangle");
      break;
    case "D":
      setOscType("sawtooth");
      break;
    case "F":
      setOscType("square");
      break;
    case "R":
      toggleReverb();
      break;
    case "L":
      toggleDelay();
      break;
  }
}

function toggleOscillator() {
  oscOn = !oscOn;
  const oscStatus = document.getElementById("oscillatorButton");
  oscStatus.textContent = oscOn ? "On" : "Off";
  oscStatus.classList.toggle("on", oscOn);
  oscStatus.classList.toggle("off", !oscOn);
  if (oscOn) {
    osc.amp(0.5 * volume, 0.05); // Apply volume multiplier
  } else {
    osc.amp(0, 0.5);
  }
  updateControlsText();
}

function setOscType(type) {
  osc.setType(type);
  updateControlsText();
}

function toggleReverb() {
  reverbOn = !reverbOn;
  const reverbStatus = document.getElementById("reverbToggle");
  if (reverbOn) {
    reverb.process(osc, 3, 2);
    reverbStatus.value = "on";
  } else {
    reverb.disconnect();
    reverbStatus.value = "off";
  }
  updateControlsText();
}

function toggleDelay() {
  delayOn = !delayOn;
  const delayStatus = document.getElementById("delayToggle");
  if (delayOn) {
    delay.process(osc, 0.12, 0.7, 2300);
    delayStatus.value = "on";
  } else {
    delay.disconnect();
    delayStatus.value = "off";
  }
  updateControlsText();
}

function updateInfoText(freq, amp) {
  const infoText = document.getElementById("infoText");
  infoText.textContent = `Fréquence : ${nf(freq, 1, 2)} Hz | Amplitude : ${nf(
    amp,
    1,
    2
  )}`;
}

function updateControlsText() {
  const controlsText = document.getElementById("controlsText");
  controlsText.innerHTML = `
        Oscillateur : ${oscOn ? "On" : "Off"} <br>
        Type : ${
          osc?.getType().charAt(0).toUpperCase() + osc?.getType().slice(1)
        } <br>
        Réverbération : ${reverbOn ? "On" : "Off"} | Délai : ${
    delayOn ? "On" : "Off"
  }
    `;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

document.getElementById("volumeSlider").addEventListener("input", (event) => {
  volume = event.target.value;
  if (oscOn && osc) {
    osc.amp(baseAmp * volume); // Update amplitude with volume
  }
});

document.getElementById("baseFreqSlider").addEventListener("input", (event) => {
  baseFreq = event.target.value;
});

document.getElementById("baseAmpSlider").addEventListener("input", (event) => {
  baseAmp = event.target.value;
  if (oscOn && osc) {
    osc.amp(baseAmp * volume); // Update amplitude with base amplitude and volume
  }
});
