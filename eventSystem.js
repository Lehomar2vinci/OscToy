document.addEventListener("DOMContentLoaded", () => {
  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.addEventListener("mouseenter", () => loop());
  canvasContainer.addEventListener("mouseleave", () => noLoop());
});
