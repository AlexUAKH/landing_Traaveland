import Swiper, { Navigation, Scrollbar, Keyboard } from "swiper";

// configure Swiper to use modules
Swiper.use([Navigation, Scrollbar, Keyboard]);

document.addEventListener("DOMContentLoaded", () => {
  // Custom JS
  bimg();

  const body = document.querySelector("body");
  const header = document.getElementsByClassName("header")[0];
  const burger = document.getElementsByClassName("burger")[0];
  const mainMenu = document.getElementsByClassName("main-menu")[0];
  const mainMenuLinks = document.getElementsByClassName("main-menu__link");
  const locationsSection = document.getElementsByClassName("locations")[0];

  // init Swiper:
  const swiper = new Swiper(".offers__slider", {
    loop: true,
    slidesPerView: 1,
    grabCursor: true,
    draggable: true,
    spaceBetween: 0,
    // Navigation arrows
    navigation: {
      nextEl: ".slider-offers__button-next",
      prevEl: ".slider-offers__button-prev"
    },

    // And if we need scrollbar
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: true
    },
    keyboard: {
      enabled: true
    },
    breakpoints: {
      510: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      769: {
        slidesPerView: 3,
        spaceBetween: 40
      },
      963: {
        slidesPerView: 4,
        spaceBetween: 50
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 70
      }
    }
  });

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
