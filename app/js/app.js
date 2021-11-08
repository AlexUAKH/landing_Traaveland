document.addEventListener("DOMContentLoaded", () => {
  // Custom JS
  bimg();

  const body = document.querySelector("body");
  const header = document.getElementsByClassName("header")[0];
  const burger = document.getElementsByClassName("burger")[0];
  const mainMenu = document.getElementsByClassName("main-menu")[0];
  const mainMenuLinks = document.getElementsByClassName("main-menu__link");
  const locationsSection = document.getElementsByClassName("locations")[0];

  window.addEventListener("scroll", () => {
    console.log("y: ", locationsSection.getClientRects());
    if (locationsSection.getClientRects()[0].top < 195) {
      header.style.background = "dimgrey";
    } else {
      header.style.background = "transparent";
    }
  });

  if (burger) {
    burger.addEventListener("click", toggleMenu);
  }
  if (mainMenuLinks) {
    for (const link of mainMenuLinks) {
      link.addEventListener("click", e => {
        e.preventDefault();
        closeMenu();
      });
    }
  }

  function toggleMenu() {
    burger.classList.toggle("active");
    mainMenu.classList.toggle("active");
    body.classList.toggle("locked");
  }

  function closeMenu() {
    burger.classList.remove("active");
    mainMenu.classList.remove("active");
  }
});

function bimg() {
  const ibg = document.querySelectorAll(".bimg");
  for (let i = 0; i < ibg.length; i++) {
    let img = ibg[i].querySelector("img");
    if (img) {
      console.log("img: ", "url('" + img.getAttribute("src") + "')");

      ibg[i].style.backgroundImage = "url('" + img.getAttribute("src") + "')";
    }
  }
}
