window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader");
  const drop = document.querySelector(".drop");
    const border = document.querySelector(".circle-border");

  let size = 0;

  setTimeout(() => {
    drop.classList.add("animate");
  }, 200);

  setTimeout(() => {
    drop.classList.add("hide");
  }, 2200);

  setTimeout(() => {
    let size = 0;
    let speed = 0.01;

    const animate = () => {
    speed += 0.02; 
    size += speed;

    preloader.style.setProperty("--size", size + "px");

    if (size < window.innerWidth * 1.5) {
        requestAnimationFrame(animate);
    } else {
        preloader.style.display = "none";
        document.body.style.overflow = "auto";
    }
    };
    border.style.opacity = "1";
    animate();
  }, 2300);
});