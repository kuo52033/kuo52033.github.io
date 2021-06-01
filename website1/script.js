const menuToggle = () => {
  const menu = document.querySelector(".menuToggle");
  const nav = document.querySelector(".navigation");
  menu.classList.toggle("active");
  nav.classList.toggle("active");
};

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 0);
});
