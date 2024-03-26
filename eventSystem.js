// // Écouteur d'événement pour activer/désactiver le dessin

document.addEventListener("DOMContentLoaded", (event) => {
    const canvasContainer = document.getElementById("canvasContainer");
    canvasContainer.addEventListener("mouseenter", function () {
    loop();
    });

    canvasContainer.addEventListener("mouseleave", function () {
    noLoop();
    });
});
