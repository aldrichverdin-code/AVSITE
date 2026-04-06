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

// ===== NEW EXPERIENCE =====
const experienceBtn = document.getElementById("experience-btn");
const newExperience = document.getElementById("new-experience");
const closeExperience = document.getElementById("close-experience");
const btnNo = document.getElementById("btn-no");
const btnYes = document.getElementById("btn-yes");
const loadingScreen = document.getElementById("loading-screen");
const progressBar = document.getElementById("progress-bar");

experienceBtn.addEventListener("click", (e) => {
    e.preventDefault();
    newExperience.classList.add("active");
    document.body.classList.add("blur-background");
});

[closeExperience, btnNo].forEach(btn => {
    btn.addEventListener("click", () => {
        newExperience.classList.remove("active");
        document.body.classList.remove("blur-background");
    });
});

newExperience.addEventListener("click", (e) => {
    if (e.target === newExperience) {
        newExperience.classList.remove("active");
        document.body.classList.remove("blur-background");
    }
});

btnYes.addEventListener("click", () => {
    newExperience.classList.remove("active");
    loadingScreen.classList.add("active");

    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            setTimeout(() => {
                window.location.href = "./components/default/Mantenimiento.html";
            }, 800);
        }

        progressBar.style.width = progress + "%";
    }, 300);
});