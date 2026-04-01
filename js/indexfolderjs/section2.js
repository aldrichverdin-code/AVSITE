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