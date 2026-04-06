// CONTENEDOR
const container = document.getElementById("sphere-container");

// MODAL
const modalSphere  = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");

const btnClose = document.querySelector(".close");
const btnLeft = document.querySelector(".left");
const btnRight = document.querySelector(".right");

let currentIndex = 0;

// ESCENA
const scene = new THREE.Scene();

// CONFIG RESPONSIVE
function getConfig() {
  if (window.innerWidth < 600) {
    return { radius: 4.0, planeWidth: 2.2, planeHeight: 1.2, cameraZ: 6.5, scale: 0.6 };
  } else if (window.innerWidth < 1024) {
    return { radius: 2.5, planeWidth: 1.6, planeHeight: 0.9, cameraZ: 6.5, scale: 0.7 };
  } else {
    return { radius: 3.5, planeWidth: 1.8, planeHeight: 1.0, cameraZ: 6.5, scale: 0.75 };
  }
}

let config = getConfig();

// CÁMARA
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.z = config.cameraZ;
camera.position.y = -1;

// RENDER
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// GRUPO
const group = new THREE.Group();
scene.add(group);

// IMÁGENES
const images = [
  "./source/img/FLIYERS/mesas.webp",
  "./source/img/FLIYERS/TACOS.webp",
  "./source/img/FLIYERS/VIAJE.webp",
  "./source/img/FLIYERS/WEB.webp",
  "./source/img/FLIYERS/WEBEXAMPLE.webp",
  "./source/img/FLIYERS/WEBGREEN.webp"
];

// TEXTURA
function createRoundedTexture(url, radius = 30) {
  const canvas = document.createElement("canvas");
  const width = 512;
  const height = 256;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;

  img.onload = () => {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, 0, 0, width, height);
    texture.needsUpdate = true;
  };

  return texture;
}

// LUCES
const pointLight = new THREE.PointLight(0xffffff, 1); // creas la luz
pointLight.position.set(5, 5, 5); // le das la posición
scene.add(pointLight); // ahora sí la agregas a la escena

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// ESFERA CENTRAL
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0xff69b4,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0xff1493,
    emissiveIntensity: 0.3
  })
);
scene.add(sphere);

// CREAR CARDS
const total = window.innerWidth < 600 ? 25 : 40;

function createCards() {
  group.clear();

  for (let i = 0; i < total; i++) {

    const phi = Math.acos(-1 + (2 * i) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    const x = config.radius * Math.cos(theta) * Math.sin(phi);
    const y = config.radius * Math.sin(theta) * Math.sin(phi);
    const z = config.radius * Math.cos(phi);

    const texture = createRoundedTexture(images[i % images.length]);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });

    const geometry = new THREE.PlaneGeometry(
      config.planeWidth,
      config.planeHeight
    );

    const plane = new THREE.Mesh(geometry, material);

    const card = new THREE.Group();
    card.add(plane);

    card.position.set(x, y, z);

    // ✅ AQUÍ ESTABA EL ERROR (ya corregido)
    card.userData = {
      originalPosition: new THREE.Vector3(x, y, z),
      index: i % images.length
    };

    group.add(card);
  }

  group.scale.set(config.scale, config.scale, config.scale);
}

createCards();

// DRAG
let isDragging = false;
let previous = { x: 0, y: 0 };

function startDrag(x, y) {
  isDragging = true;
  previous = { x, y };
}

function moveDrag(x, y) {
  if (!isDragging) return;

  const dx = x - previous.x;
  const dy = y - previous.y;

  group.rotation.y += dx * 0.005;
  group.rotation.x += dy * 0.005;

  previous = { x, y };
}

function endDrag() {
  isDragging = false;
}

// MOUSE
container.addEventListener("mousedown", e => startDrag(e.clientX, e.clientY));
window.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
window.addEventListener("mouseup", endDrag);

// TOUCH
container.addEventListener("touchstart", e => {
  const t = e.touches[0];
  startDrag(t.clientX, t.clientY);
});

window.addEventListener("touchmove", e => {
  const t = e.touches[0];
  moveDrag(t.clientX, t.clientY);
});

window.addEventListener("touchend", endDrag);

// CLICK (MODAL)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

container.addEventListener("click", (event) => {

  if (isDragging) return; // ✅ evita conflicto drag

  const rect = renderer.domElement.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(group.children, true);

  if (intersects.length > 0) {
    const selected = intersects[0].object.parent;

    currentIndex = selected.userData.index;

    modalSphere.style.display = "flex";
    modalImg.src = images[currentIndex];
  }
});

// CONTROLES MODAL
btnClose.onclick = () => modalSphere.style.display = "none";

btnLeft.onclick = () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  modalImg.src = images[currentIndex];
};

btnRight.onclick = () => {
  currentIndex = (currentIndex + 1) % images.length;
  modalImg.src = images[currentIndex];
};

// cerrar al fondo
modalSphere.addEventListener("click", (e) => {
  if (e.target === modalSphere) modalSphere.style.display = "none";
});

document.addEventListener("keydown", (e) => {
  if (modalSphere.style.display === "flex") {

    if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % images.length;
      modalImg.src = images[currentIndex];
    }

    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      modalImg.src = images[currentIndex];
    }

    if (e.key === "Escape") {
      modalSphere.style.display = "none";
    }
  }
});

//CAMBIAR EL MODAL
let startX = 0;

modalImg.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

modalImg.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) {
    // swipe izquierda → siguiente
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex];
  }

  if (endX - startX > 50) {
    // swipe derecha → anterior
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex];
  }
});

//ZOOM MODAL
let zoomed = false;

modalImg.addEventListener("click", () => {
  zoomed = !zoomed;

  if (zoomed) {
    modalImg.style.transform = "scale(1.5)";
    modalImg.style.cursor = "zoom-out";
  } else {
    modalImg.style.transform = "scale(1)";
    modalImg.style.cursor = "zoom-in";
  }
});

modalImg.style.transform = "scale(1)";
zoomed = false;

btnRight.onclick = () => {
  currentIndex = (currentIndex + 1) % images.length;
  modalImg.src = images[currentIndex];
  modalImg.style.transform = "scale(1)";
  zoomed = false;
};

// RESPONSIVE
window.addEventListener("resize", () => {
  config = getConfig();

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.position.z = config.cameraZ;

  createCards();
});

// ANIMACIÓN
function animate() {
  requestAnimationFrame(animate);

  group.rotation.y += 0.002;
  sphere.rotation.y += 0.01;

  group.children.forEach(card => {
    const worldPos = new THREE.Vector3();
    card.getWorldPosition(worldPos);

    const plane = card.children[0];

    if (worldPos.z > 0) {
      plane.material.opacity = 1;
      card.scale.lerp(new THREE.Vector3(1.2,1.2,1.2), 0.1);
    } else {
      plane.material.opacity = 0.3;
      card.scale.lerp(new THREE.Vector3(0.7,0.7,0.7), 0.1);
    }

    card.lookAt(camera.position);
  });

  renderer.render(scene, camera);
}

animate();