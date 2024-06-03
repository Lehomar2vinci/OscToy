document.addEventListener("DOMContentLoaded", () => {
  const canvasContainer = document.getElementById("canvasContainer");
  const menuButton = document.getElementById("menuButton");
  const oscillatorButton = document.getElementById("oscillatorButton");
  const helpButton = document.getElementById("helpButton");
  const menu = document.getElementById("menu");
  const helpText = document.getElementById("helpText");
  const oscTypeSpinner = document.getElementById("oscTypeSpinner");
  const reverbToggle = document.getElementById("reverbToggle");
  const delayToggle = document.getElementById("delayToggle");

  // Activer/désactiver l'animation lorsque la souris entre/sort du conteneur
  canvasContainer.addEventListener("mouseenter", (event) => {
    event.stopPropagation();
    console.log("Mouse entered canvas");
    loop();
  });
  canvasContainer.addEventListener("mouseleave", (event) => {
    event.stopPropagation();
    console.log("Mouse left canvas");
    noLoop();
  });

  // Gérer les événements tactiles pour les appareils mobiles
  canvasContainer.addEventListener("touchstart", (event) => {
    event.stopPropagation();
    console.log("Touch start on canvas");
    loop();
  });
  canvasContainer.addEventListener("touchend", (event) => {
    event.stopPropagation();
    console.log("Touch end on canvas");
    noLoop();
  });

  // Afficher/masquer le menu lorsque le bouton est cliqué
  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("Menu button clicked");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  // Activer/désactiver l'oscillateur lorsque le bouton est cliqué
  oscillatorButton.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("Oscillator button clicked");
    toggleOscillator();
  });

  // Afficher/masquer le texte d'aide lorsque le bouton est cliqué
  helpButton.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("Help button clicked");
    helpText.style.display =
      helpText.style.display === "block" ? "none" : "block";
  });

  // Gérer le changement de type d'oscillateur
  oscTypeSpinner.addEventListener("change", (event) => {
    setOscType(event.target.value);
  });

  // Gérer l'activation/désactivation de la réverbération
  reverbToggle.addEventListener("change", (event) => {
    toggleReverb(event.target.value === "on");
  });

  // Gérer l'activation/désactivation du délai
  delayToggle.addEventListener("change", (event) => {
    toggleDelay(event.target.value === "on");
  });
});

function closeMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "none";
  console.log("Menu closed");
}
