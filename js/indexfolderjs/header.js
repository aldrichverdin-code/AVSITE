//Menu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const menuIcon = document.getElementById("menuIcon");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    menuToggle.classList.toggle("active");

    if (menuIcon.classList.contains("fa-bars")) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-circle");
    } else {
        menuIcon.classList.remove("fa-circle");
        menuIcon.classList.add("fa-bars");
    }
});

document.addEventListener("click", (event) => {
    const isClickInside = navLinks.contains(event.target) || menuToggle.contains(event.target);

    if (!isClickInside && navLinks.classList.contains("show")) {
        navLinks.classList.remove("show");

        menuIcon.classList.remove("fa-circle");
        menuIcon.classList.add("fa-bars");
        menuToggle.classList.remove("active");
    }
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");

        menuIcon.classList.remove("fa-circle");
        menuIcon.classList.add("fa-bars");
        menuToggle.classList.remove("active");
    });
});