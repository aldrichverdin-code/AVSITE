const bentoModal = document.getElementById("modal");
const bentoModalImg = document.getElementById("modal-img");
const bentoCloseBtn = document.querySelector(".close");

document.querySelectorAll(".bento-item img").forEach(img => {
    img.addEventListener("click", () => {
        bentoModal.style.display = "flex";
        bentoModalImg.src = img.src;
    });
});

bentoCloseBtn.onclick = () => bentoModal.style.display = "none";

bentoModal.onclick = (e) => {
    if (e.target === bentoModal) bentoModal.style.display = "none";
};