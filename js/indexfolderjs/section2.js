//section 2
//efecto reveal
const reveals = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
);

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    {
        threshold: 0.2
    }
);

reveals.forEach(el => observer.observe(el));

//efecto border
const section2 = document.querySelector(".section-2");

const sectionObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section2.classList.add("show-lines");
            }
        });
    },
    { threshold: 0.3 }
);

sectionObserver.observe(section2);

//seccion 4
function activateSlide(element) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove('active'));
    element.classList.add('active');
}

let currentImages = [];
let currentIndexfolderfolder = 0;

const prevBtn = document.getElementById("prevImg");
const nextBtn = document.getElementById("nextImg");

const modal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");

const videoPlayer = document.getElementById("videoPlayer");
const videoSource = document.getElementById("videoSource");
const fallbackImage = document.getElementById("fallbackImage");

document.querySelectorAll(".See-button").forEach(button => {
    button.addEventListener("click", (e) => {
        e.stopPropagation();

        const videoURL = button.getAttribute("data-video");
        const imagesAttr = button.getAttribute("data-images");

        videoPlayer.style.display = "none";
        fallbackImage.style.display = "none";

        currentImages = [];
        currentIndexfolder = 0;

        if (videoURL) {
            videoSource.src = videoURL;
            videoPlayer.load();
            videoPlayer.style.display = "block";
            videoPlayer.play();

            prevBtn.style.display = "none";
            nextBtn.style.display = "none";

        } else if (imagesAttr) {
            currentImages = imagesAttr.split(",").map(img => img.trim());

            fallbackImage.src = currentImages[currentIndexfolder];
            fallbackImage.style.display = "block";

            prevBtn.style.display = "block";
            nextBtn.style.display = "block";
        }

        modal.classList.add("active");
    });
});

// cerrar modal
function closeModalFunc() {
    modal.classList.remove("active");
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
}

closeModal.addEventListener("click", closeModalFunc);

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});


// BOTÓN SIGUIENTE
nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (currentImages.length > 0) {
        currentIndexfolder = (currentIndexfolder + 1) % currentImages.length;
        fallbackImage.src = currentImages[currentIndexfolder];
    }
});

// BOTÓN ANTERIOR
prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (currentImages.length > 0) {
        currentIndexfolder = (currentIndexfolder - 1 + currentImages.length) % currentImages.length;
        fallbackImage.src = currentImages[currentIndexfolder];
    }
});