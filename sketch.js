// // FIRST VERSION

// let osc, fft;

// function setup() {
//     let cnv = createCanvas(800, 600);
//     cnv.parent("canvasContainer");
//     osc = new p5.Oscillator("sine");
//     fft = new p5.FFT();
//     osc.start();
//     osc.amp(0.5, 1); // Amp à 0.5, sur 1 seconde
// }

// function draw() {
//     let freq = map(mouseX, 0, width, 100, 500);
//     osc.freq(freq);

//     let amp = map(mouseY, 0, height, 1, 0);
//     osc.amp(amp);

//     let degradation = map(mouseX + mouseY, 0, width + height, 0, 255);
//     background(degradation, 100, 255 - degradation, 25);

//     let waveform = fft.waveform();
//     noFill();
//     stroke(255 - degradation, degradation, 100);
//     strokeWeight(2);
//     beginShape();
//     for (let i = 0; i < waveform.length; i++) {
//         let x = map(i, 0, waveform.length, 0, width);
//         let y = map(waveform[i], -1, 1, 0, height);
//         vertex(x, y);
//     }
//     endShape();

//   // Mise à jour du texte d'information
//     document.getElementById("infoText").textContent = `Fréquence: ${freq.toFixed(
//     2)} Hz | Amplitude: ${amp.toFixed(2)}`;

//   // Appliquer l'effet de glitch si l'amplitude est élevée
//     if (amp > 0.8) {
//     applyGlitchEffect();
//     }
// }

// function applyGlitchEffect() {
//     loadPixels();
//     for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//             if (random() < 0.1) {
//         // Probabilité de glitch sur chaque pixel
//                 let index = (x + y * width) * 4;
//                 let offset = int(random(-10, 10)) * 4;
//                 pixels[index] = pixels[index + offset];
//                 pixels[index + 1] = pixels[index + 1 + offset];
//                 pixels[index + 2] = pixels[index + 2 + offset];
//                 }
//             }
//         }
//     updatePixels();
// }

// function mousePressed() {
//     if (osc.started) {
//         osc.stop();
//     } else {
//         osc.start();
//     }
// }


////// 2ND VERSION :

let osc, fft;
let mode = "visual"; // Les modes possibles sont 'visual' et 'instrument'

function setup() {
    let cnv = createCanvas(800, 600);
    cnv.parent("canvasContainer");
    osc = new p5.Oscillator("sine");
    fft = new p5.FFT();
    osc.start();
    osc.amp(0); // Commence avec l'amplitude à 0 pour éviter le son au chargement
}

function draw() {
    if (mode === "visual") {
    drawVisualMode();
    } else if (mode === "instrument") {
    drawInstrumentMode();
    }
}

function drawVisualMode() {
    let freq = map(mouseX, 0, width, 100, 500);
    osc.freq(freq);

    let amp = map(mouseY, 0, height, 1, 0);
    osc.amp(amp);

    let degradation = map(mouseX + mouseY, 0, width + height, 0, 255);
    background(degradation, 100, 255 - degradation, 25);

    let waveform = fft.waveform();
    noFill();
    stroke(255 - degradation, degradation, 100);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, 0, height);
        vertex(x, y);
        }
    endShape();

    if (amp > 0.8) {
        applyGlitchEffect();
    }
}

function drawInstrumentMode() {
      // CMode futur
      // Pour l'instant, drawVisualMode pour l'exemple
    drawVisualMode();
}

function applyGlitchEffect() {
    loadPixels();
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (random() < 0.1) {
            let index = (x + y * width) * 4;
            let offset = int(random(-10, 10)) * 4;
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
        mode = mode === "visual" ? "instrument" : "visual";
        console.log("Mode switched to: " + mode);
    } else if (mode === "instrument") {
        switch (key) {
            case "A":
            osc.setType("sine");
            break;
            case "a":
            osc.setType("sine");
            break
            case "S":
            osc.setType("triangle");
            break;
            case "s":
            osc.setType("triangle");
            break;
            case "D":
            osc.setType("sawtooth");
            break;
            case "d":
            osc.setType("sawtooth");
            break;
            case "F":
            osc.setType("square");
            break;
            case "f":
            osc.setType("square");
            break;
        }
    }
}