let osc, fft, reverb, delay, noise;
let reverbOn = true;
let delayOn = true;
let oscOn = false;
let noiseOn = false;
let bgColor;
let baseFreq = 440;
let baseAmp = 0.5;
let volume = 0.5; // Initial volume
let reverbTime = 3;
let reverbDecay = 2;
let delayTime = 0.12;
let delayFeedback = 0.7;
let limiter;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvasContainer");

  userStartAudio().then(() => {
    osc = new p5.Oscillator("sine");
    osc.start();
    osc.amp(0); // Initialize with zero amplitude

    noise = new p5.Noise('white');
    noise.start();
    noise.amp(0);

    fft = new p5.FFT();

    reverb = new p5.Reverb();
    reverb.process(osc, reverbTime, reverbDecay);
    reverb.process(noise, reverbTime, reverbDecay);

    delay = new p5.Delay();
    delay.process(osc, delayTime, delayFeedback, 2300);
    delay.process(noise, delayTime, delayFeedback, 2300);

    limiter = new p5.Compressor();
    limiter.threshold(-1);
    limiter.ratio(20);
    limiter.attack(0.001);
    limiter.release(0.1);
    osc.disconnect();
    noise.disconnect();
    limiter.process(osc);
    limiter.process(noise);
  });

  bgColor = color(0, 0, 0);
  updateControlsText();
}

function draw() {
  background(bgColor);

  if (oscOn || noiseOn) {
    drawVisualMode();
  }
}

function drawVisualMode() {
  const freq = map(mouseX, 0, width, 100, 500) + parseFloat(baseFreq);
  const amp = map(mouseY, 0, height, 1, 0) * parseFloat(baseAmp);

  if (osc && oscOn) {
    osc.freq(freq);
    osc.amp(amp * volume);
  }

  if (noise && noiseOn) {
    noise.amp(amp * volume);
  }

  const colorRatioX = map(mouseX, 0, width, 0, 255);
  const colorRatioY = map(mouseY, 0, height, 0, 255);
  bgColor = color(colorRatioX, 100, colorRatioY);

  const waveform = fft.waveform();
  noFill();
  stroke(255 - colorRatioX, colorRatioX, 100);
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
  if ((oscOn && osc) || (noiseOn && noise)) {
    if (oscOn && osc) {
      osc.amp(0.5 * volume, 0.05); // Apply volume multiplier
    }
    if (noiseOn && noise) {
      noise.amp(0.5 * volume, 0.05);
    }
  }
}

function mouseReleased() {
  if ((oscOn && osc) || (noiseOn && noise)) {
    if (oscOn && osc) {
      osc.amp(0, 0.5);
    }
    if (noiseOn && noise) {
      noise.amp(0, 0.5);
    }
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
    case "N":
      toggleNoise();
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
    noiseOn = false; // Ensure noise is off
    updateNoiseButton();
  } else {
    osc.amp(0, 0.5);
  }
  updateControlsText();
}

function toggleNoise() {
  noiseOn = !noiseOn;
  const noiseStatus = document.getElementById("noiseButton");
  noiseStatus.textContent = noiseOn ? "On" : "Off";
  noiseStatus.classList.toggle("on", noiseOn);
  noiseStatus.classList.toggle("off", !noiseOn);
  if (noiseOn) {
    noise.amp(0.5 * volume, 0.05);
    oscOn = false; // Ensure oscillator is off
    updateOscillatorButton();
  } else {
    noise.amp(0, 0.5);
  }
  updateControlsText();
}

function setOscType(type) {
  if (type === 'noise') {
    toggleNoise();
    return;
  }
  osc.setType(type);
  updateControlsText();

  const oscTypeButtons = document.querySelectorAll(".oscTypeButton");
  oscTypeButtons.forEach(button => {
    button.setAttribute("aria-pressed", button.getAttribute("data-type") === type ? "true" : "false");
  });
}

function toggleReverb() {
  reverbOn = !reverbOn;
  const reverbToggle = document.getElementById("reverbToggle");
  reverbToggle.textContent = reverbOn ? "On" : "Off";
  reverbToggle.classList.toggle("on", reverbOn);
  reverbToggle.classList.toggle("off", !reverbOn);
  reverbToggle.setAttribute("aria-pressed", reverbOn);
  if (reverbOn) {
    reverb = new p5.Reverb();
    reverb.process(osc, reverbTime, reverbDecay);
    reverb.process(noise, reverbTime, reverbDecay);
  } else {
    reverb.disconnect();
  }
  updateControlsText();
}

function toggleDelay() {
  delayOn = !delayOn;
  const delayToggle = document.getElementById("delayToggle");
  delayToggle.textContent = delayOn ? "On" : "Off";
  delayToggle.classList.toggle("on", delayOn);
  delayToggle.classList.toggle("off", !delayOn);
  delayToggle.setAttribute("aria-pressed", delayOn);
  if (delayOn) {
    delay = new p5.Delay();
    delay.process(osc, delayTime, delayFeedback, 2300);
    delay.process(noise, delayTime, delayFeedback, 2300);
  } else {
    delay.disconnect();
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
        Bruit : ${noiseOn ? "On" : "Off"} <br>
        Type : ${
          osc?.getType().charAt(0).toUpperCase() + osc?.getType().slice(1)
        } <br>
        Réverbération : ${reverbOn ? "On" : "Off"} (Time: ${reverbTime}s, Decay: ${reverbDecay}) <br>
        Délai : ${delayOn ? "On" : "Off"} (Time: ${delayTime}s, Feedback: ${delayFeedback})
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
  if (noiseOn && noise) {
    noise.amp(baseAmp * volume);
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
  if (noiseOn && noise) {
    noise.amp(baseAmp * volume);
  }
});

document.getElementById("reverbTimeSlider").addEventListener("input", (event) => {
  reverbTime = event.target.value;
  if (reverbOn) {
    reverb.set(reverbTime, reverbDecay);
  }
  updateControlsText();
});

document.getElementById("reverbDecaySlider").addEventListener("input", (event) => {
  reverbDecay = event.target.value;
  if (reverbOn) {
    reverb.set(reverbTime, reverbDecay);
  }
  updateControlsText();
});

document.getElementById("delayTimeSlider").addEventListener("input", (event) => {
  delayTime = event.target.value;
  if (delayOn) {
    delay.process(osc, delayTime, delayFeedback, 2300);
    delay.process(noise, delayTime, delayFeedback, 2300);
  }
  updateControlsText();
});

document.getElementById("delayFeedbackSlider").addEventListener("input", (event) => {
  delayFeedback = event.target.value;
  if (delayOn) {
    delay.process(osc, delayTime, delayFeedback, 2300);
    delay.process(noise, delayTime, delayFeedback, 2300);
  }
  updateControlsText();
});

const oscTypeButtons = document.querySelectorAll(".oscTypeButton");
oscTypeButtons.forEach(button => {
  button.addEventListener("click", () => {
    setOscType(button.getAttribute("data-type"));
  });
});

// New functions for saving and loading settings
document.getElementById("saveButton").addEventListener("click", saveSettings);
document.getElementById("loadButton").addEventListener("click", loadSettings);

function saveSettings() {
  const settings = {
    oscType: osc.getType(),
    volume: volume,
    baseFreq: baseFreq,
    baseAmp: baseAmp,
    reverbOn: reverbOn,
    reverbTime: reverbTime,
    reverbDecay: reverbDecay,
    delayOn: delayOn,
    delayTime: delayTime,
    delayFeedback: delayFeedback,
    noiseOn: noiseOn,
  };
  localStorage.setItem('oscToySettings', JSON.stringify(settings));
  showNotification('Settings saved!');
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('oscToySettings'));
  if (settings) {
    setOscType(settings.oscType);
    document.getElementById("volumeSlider").value = settings.volume;
    document.getElementById("baseFreqSlider").value = settings.baseFreq;
    document.getElementById("baseAmpSlider").value = settings.baseAmp;
    document.getElementById("reverbTimeSlider").value = settings.reverbTime;
    document.getElementById("reverbDecaySlider").value = settings.reverbDecay;
    document.getElementById("delayTimeSlider").value = settings.delayTime;
    document.getElementById("delayFeedbackSlider").value = settings.delayFeedback;
    volume = settings.volume;
    baseFreq = settings.baseFreq;
    baseAmp = settings.baseAmp;
    reverbTime = settings.reverbTime;
    reverbDecay = settings.reverbDecay;
    delayTime = settings.delayTime;
    delayFeedback = settings.delayFeedback;
    if (settings.reverbOn !== reverbOn) toggleReverb();
    if (settings.delayOn !== delayOn) toggleDelay();
    if (settings.noiseOn !== noiseOn) toggleNoise();
    showNotification('Settings loaded!');
  } else {
    showNotification('No saved settings found.');
  }
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

function updateOscillatorButton() {
  const oscStatus = document.getElementById("oscillatorButton");
  oscStatus.textContent = oscOn ? "On" : "Off";
  oscStatus.classList.toggle("on", oscOn);
  oscStatus.classList.toggle("off", !oscOn);
}

function updateNoiseButton() {
  const noiseStatus = document.getElementById("noiseButton");
  noiseStatus.textContent = noiseOn ? "On" : "Off";
  noiseStatus.classList.toggle("on", noiseOn);
  noiseStatus.classList.toggle("off", !noiseOn);
}
