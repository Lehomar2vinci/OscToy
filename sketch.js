let osc, fft;
let reverb, delay;
let reverbOn = true;
let delayOn = true;
let mode = "visual";
let bgColor;
let glitch = false;

function setup() {
    const cnv = createCanvas(800, 600);
    cnv.parent("canvasContainer");
    osc = new p5.Oscillator("sine");
    fft = new p5.FFT();
    reverb = new p5.Reverb();
    delay = new p5.Delay();

    osc.amp(0);
    reverb.process(osc, 3, 2);
    delay.process(osc, 0.12, 0.7, 2300);

    bgColor = color(0, 0, 0);
    updateControlsText();
}

function draw() {
    background(bgColor);

    if (mode === "visual") {
        drawVisualMode();
    } else if (mode === "instrument") {
        drawInstrumentMode();
    }
}

function drawVisualMode() {
    const freq = map(mouseX, 0, width, 100, 500);
    osc.freq(freq);

    const amp = map(mouseY, 0, height, 1, 0);
    osc.amp(amp);

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

function drawInstrumentMode() {
    drawVisualMode();
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
    if (mode === "instrument") {
        osc.start();
    }
}

function mouseReleased() {
    if (mode === "instrument") {
        osc.stop();
    }
}

function keyPressed() {
    if (key === "M" || key === "m") {
        toggleMode();
    } else if (mode === "instrument") {
        switch (key.toUpperCase()) {
            case "A":
                osc.setType("sine");
                break;
            case "S":
                osc.setType("triangle");
                break;
            case "D":
                osc.setType("sawtooth");
                break;
            case "F":
                osc.setType("square");
                break;
            case "R":
                toggleReverb();
                break;
            case "L":
                toggleDelay();
                break;
        }
    }
}

function toggleMode() {
    mode = mode === "visual" ? "instrument" : "visual";
    console.log("Mode switched to: " + mode);
    updateControlsText();
}

function toggleReverb() {
    reverbOn = !reverbOn;
    if (reverbOn) {
        reverb = new p5.Reverb();
        reverb.process(osc, 3, 2);
    } else {
        reverb.disconnect();
    }
    updateControlsText();
}

function toggleDelay() {
    delayOn = !delayOn;
    if (delayOn) {
        delay = new p5.Delay();
        delay.process(osc, 0.12, 0.7, 2300);
    } else {
        delay.disconnect();
    }
    updateControlsText();
}

function updateInfoText(freq, amp) {
    const infoText = document.getElementById("infoText");
    infoText.textContent = `Fréquence : ${nf(freq, 1, 2)} Hz | Amplitude : ${nf(amp, 1, 2)}`;
}

function updateControlsText() {
    const controlsText = document.getElementById("controlsText");
    controlsText.innerHTML = `
        Appuyez sur 'M' pour changer de mode. <br>
        Mode instrument : A (Sine), S (Triangle), D (Sawtooth), F (Square) <br>
        R : Activer/Désactiver Réverb (${reverbOn ? "On" : "Off"}) | L : Activer/Désactiver Delay (${delayOn ? "On" : "Off"})
    `;
}
