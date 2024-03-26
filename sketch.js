let osc, fft;

function setup() {
    createCanvas(800, 600);
    osc = new p5.Oscillator('sine');
    fft = new p5.FFT();
    osc.start();
    osc.amp(0.5,1); //Amp à 0.5, sur 1 seconde
}

function draw () {
    //background (100); //couleur du fond

    let freq = map (mouseX, 0, width, 100,500);
    osc.freq(freq);

    let amp = map(mouseY, 0, height, 1, 0);
    osc.amp(amp);

    //test couleur de fond basé sur la frequence

    let bgColor = map(freq, 100, 500, 0, 255);
    background(bgColor, 100, 255 - bgColor);

    //visual

    let waveform = fft.waveform();
    noFill();
    stroke(255 * bgColor, 100);
    strokeWeight(2)
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, 0, height);
        vertex(x, y);
    }
    endShape();

    fill(255);
    noStroke();
    textSize(16);
    text("Fréquence: " + freq.toFixed(2) + " Hz", 10, 20);
    text("Amplitude: " + amp.toFixed(2), 10, 40);
}

function mousePressed() { 
    let freq = map(mouseX, 0, width, 100, 500);
    let amp = map(mouseY, 0, height, 1, 0);
    let size = map(amp, 0, 1, 10, 100);
    let color = map(freq, 100, 500, 0, 255);
    fill(color, 100, 255 - color, 127);
    noStroke();
    ellipse(mouseX, mouseY, size, size);
    if (osc.started) {
        osc.stop();
    } else {
        osc.start();
    }
}