let osc, fft;
let reverb, delay;
let reverbOn = true;
let delayOn = true;
let oscOn = false;
let bgColor;
let glitch = false;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvasContainer");

  userStartAudio().then(() => {
    osc = new p5.Oscillator("sine");
    osc.start();
    osc.amp(0);

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
  const freq = map(mouseX || (touches[0]?.x ?? width / 2), 0, width, 100, 500);
  if (osc) osc.freq(freq);

  const amp = map(mouseY || (touches[0]?.y ?? height / 2), 0, height, 1, 0);
  if (osc) osc.amp(amp);

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

  if (amp > 0.8 && !glitch) {
    applyGlitchEffect();
    glitch = true;
  } else if (amp <= 0.8) {
    glitch = false;
  }

  updateInfoText(freq, amp);
}

function applyGlitchEffect() {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (random() < 0.1) {
        const index = (x + y * width) * 4;
        const offset = int(random(-10, 10)) * 4;
        pixels[index] = pixels[index + offset];
        pixels[index + 1] = pixels[index + 1 + offset];
        pixels[index + 2] = pixels[index + 2 + offset];
      }
    }
  }
  updatePixels();
}

function mousePressed() {
  if (oscOn && osc) {
    osc.amp(0.5, 0.05);
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
  console.log("Oscillator is now: " + (oscOn ? "On" : "Off"));
  const oscStatus = document.getElementById("oscillatorButton");
  oscStatus.textContent = oscOn ? "On" : "Off";
  oscStatus.classList.toggle("on", oscOn);
  oscStatus.classList.toggle("off", !oscOn);
  if (oscOn) {
    osc.amp(0.5, 0.05);
  } else {
    osc.amp(0, 0.5);
  }
  updateControlsText();
}

function toggleReverb() {
  reverbOn = !reverbOn;
  const reverbStatus = document.getElementById("reverbToggle");
  if (reverbOn) {
    reverb.disconnect();
    reverb = new p5.Reverb();
    reverb.process(osc, 3, 2);
    reverbStatus.value = "on";
    console.log("Reverb On");
  } else {
    reverb.disconnect();
    reverbStatus.value = "off";
    console.log("Reverb Off");
  }
  updateControlsText();
}

function toggleDelay() {
  delayOn = !delayOn;
  const delayStatus = document.getElementById("delayToggle");
  if (delayOn) {
    delay.disconnect();
    delay = new p5.Delay();
    delay.process(osc, 0.12, 0.7, 2300);
    delayStatus.value = "on";
    console.log("Delay On");
  } else {
    delay.disconnect();
    delayStatus.value = "off";
    console.log("Delay Off");
  }
  updateControlsText();
}

function setOscType(type) {
  if (osc) osc.setType(type);
  console.log("Oscillator type set to: " + type);
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
        Appuyez sur 'M' pour activer/désactiver l'oscillateur. <br>
        Oscillateur : ${oscOn ? "On" : "Off"} <br>
        Type : ${
          osc?.getType().charAt(0).toUpperCase() + osc?.getType().slice(1)
        } <br>
        Réverb : ${reverbOn ? "On" : "Off"} | Delay : ${delayOn ? "On" : "Off"}
    `;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
