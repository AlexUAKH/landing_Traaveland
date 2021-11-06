// // Import vendor jQuery plugin example
// import '~/app/libs/mmenu/dist/mmenu.js'

document.addEventListener("DOMContentLoaded", () => {
  // Custom JS
  ibg();
});

function ibg() {
  const ibg = document.querySelectorAll(".ibg");
  for (let i = 0; i < ibg.length; i++) {
    let img = ibg[i].querySelector("img");
    if (img) {
      ibg[i].style.backgroundimage = "url(" + img.getAttribute("src") + ")";
    }
  }
}
