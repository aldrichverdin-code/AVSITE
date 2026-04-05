//seccion 5
const video = document.querySelector('.today-video');
const playPause = document.getElementById('playPause');
const progress = document.getElementById('progress');
const back10 = document.getElementById('back10');
const forward10 = document.getElementById('forward10');
const fullscreenBtn = document.getElementById('fullscreen');
const timeDisplay = document.getElementById('timeDisplay');
const canvas = document.getElementById('previewCanvas');
const timePreview = document.getElementById('timePreview');

const volumeBtn = document.getElementById('volumeBtn');
const volumeBar = document.getElementById('volume');
const volumeIcon = volumeBtn.querySelector('i');

const videoContainer = document.querySelector('.video-left');

const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.querySelector('.settings-menu');
const mainMenu = document.querySelector('.menu-main');
const speedMenu = document.getElementById('speed-menu');
const qualityMenu = document.getElementById('quality-menu');


document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".card img");
    const imgModalBox = document.getElementById("imgModal");
    const modalImgvideo = document.getElementById("modalImg");

    cards.forEach(img => {
        img.addEventListener("click", () => {
            console.log("click"); // 🔥 debug
            imgModalBox.classList.add("show");
            modalImgvideo.src = img.src;
        });
    });

    imgModalBox.addEventListener("click", (e) => {
        if (e.target === imgModalBox) {
            imgModalBox.classList.remove("show");
        }
    });

});

const ctx = canvas.getContext('2d');
canvas.width = 160;
canvas.height = 90;

/*CONFIGURACION PREVIA*/
const previewVideo = document.createElement('video');
previewVideo.src = video.currentSrc;
previewVideo.muted = true;
previewVideo.preload = 'metadata';

/* PLAY / PAUSE */
function toggleVideo() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

// Botón grande en la pantalla
const bigPlayBtn = document.querySelector('.play-btn');
bigPlayBtn.addEventListener('click', toggleVideo);

// Botón pequeño de controles
playPause.addEventListener('click', toggleVideo);

// Click en el video también puede pausar/reproducir
video.addEventListener('click', toggleVideo);

// Actualizar iconos y visibilidad de playBtn
video.addEventListener('play', () => {
    playPause.textContent = '⏸';
    bigPlayBtn.style.display = 'none';
});

video.addEventListener('pause', () => {
    playPause.textContent = '▶';
    bigPlayBtn.style.display = 'grid';
});

/* PROGRESS BAR */
video.ontimeupdate = () => {
    progress.value = (video.currentTime / video.duration) * 100;
    timeDisplay.textContent =
        `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
};

progress.addEventListener('click', (e) => {
    const rect = progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);

    video.currentTime = percent * video.duration;
});

video.addEventListener('loadedmetadata', () => {
    progress.value = 0; // empieza desde 0
    progress.max = 100; // maximo del range
    timeDisplay.textContent = `${formatTime(0)} / ${formatTime(video.duration)}`;
});

video.addEventListener('timeupdate', () => {
    const percent = (video.currentTime / video.duration) * 100;
    progress.value = percent;
    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
});

function updateProgressGradient() {
    const percent = (video.currentTime / video.duration) * 100;
    progress.style.background = `linear-gradient(to right, #ff659e 0%, #ff659e ${percent}%, rgba(255,255,255,0.2) ${percent}%, rgba(255,255,255,0.2) 100%)`;
}

video.addEventListener('timeupdate', updateProgressGradient);
progress.addEventListener('input', updateProgressGradient);

/*HOVER PREVIEW BAR*/
progress.addEventListener('mousemove', (e) => {
    const rect = progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);

    const previewTime = percent * video.duration;
    previewVideo.currentTime = previewTime;

    previewVideo.onseeked = () => {
        ctx.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);
    };

    const containerRect = document
        .querySelector('.video-left')
        .getBoundingClientRect();

    const leftInsideContainer = e.clientX - containerRect.left;

    canvas.style.display = 'block';
    canvas.style.left = (leftInsideContainer - canvas.width / 2) + 'px';

    timePreview.style.display = 'block';
    timePreview.style.left = (leftInsideContainer - 20) + 'px';
    timePreview.textContent = formatTime(previewTime);
});

progress.addEventListener('mouseleave', () => {
    canvas.style.display = 'none';
    timePreview.style.display = 'none';
});

/* VOLUME */
// Mostrar/ocultar barra vertical con animación
volumeBtn.addEventListener('click', () => {
    volumeBar.classList.toggle('show');
});

// Cambiar volumen y actualizar barra + icono
volumeBar.addEventListener('input', () => {
    video.volume = volumeBar.value;

    // Actualizar gradiente de la barra
    volumeBar.style.setProperty('--value', volumeBar.value);

    // Cambiar icono según volumen
    if (volumeBar.value == 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark'; // mute
    } else if (volumeBar.value <= 0.3) {
        volumeIcon.className = 'fa-solid fa-volume-off'; // bajo
    } else if (volumeBar.value <= 0.7) {
        volumeIcon.className = 'fa-solid fa-volume-low'; // bajo
    } else if (volumeBar.value > 0.7) {
        volumeIcon.className = 'fa-solid fa-volume-high'; // medio/alto
    }
});

volumeBar.addEventListener('change', () => {
    setTimeout(() => {
        volumeBar.classList.remove('show');
    }, 500); // medio segundo
});

/* +10 / -10 */
function animateButton(button) {
    button.style.transition = 'transform 0.1s ease';
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

back10.addEventListener('click', () => {
    animateButton(back10);
    video.currentTime = Math.max(0, video.currentTime - 10); // retrocede 10s
});

forward10.addEventListener('click', () => {
    animateButton(forward10);
    video.currentTime = Math.min(video.duration, video.currentTime + 10); // avanza 10s
});

videoContainer.addEventListener('dblclick', (e) => {
    const rect = videoContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const middle = rect.width / 2;

    if (clickX < middle) {
        // IZQUIERDA → retroceder
        video.currentTime = Math.max(0, video.currentTime - 10);
        showSeekFeedback('back');
    } else {
        // DERECHA → avanzar
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
        showSeekFeedback('forward');
    }
});

function showSeekFeedback(type) {
    const el = document.querySelector(`.seek-feedback.${type === 'back' ? 'left' : 'right'}`);
    
    el.classList.add('show');

    setTimeout(() => {
        el.classList.remove('show');
    }, 400);
}

/* FULLSCREEN */
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen(); 
    } else {
        document.exitFullscreen();
    }
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        videoContainer.classList.add('fullscreen-mode');
    } else {
        videoContainer.classList.remove('fullscreen-mode');
    }
});

let uiTimeout;

/* FULL SCREEN MENU CONFIG*/

uiTimeout = setTimeout(() => {
    videoContainer.classList.remove('show-ui');
    settingsMenu.classList.remove('show'); 
}, 2000);

// abrir/cerrar menú
settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle('show');
});

// cerrar al hacer click fuera
document.addEventListener('click', () => {
    settingsMenu.classList.remove('show');
});

settingsMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// cambiar velocidad
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const speed = item.getAttribute('data-speed');

        if (speed) {
            video.playbackRate = parseFloat(speed);
        }
    });
});

// TOGGLE SUBMENUS
document.querySelectorAll('.has-submenu').forEach(item => {
    item.addEventListener('click', () => {

        const menu = item.dataset.menu === 'speed' ? speedMenu : qualityMenu;

        const isOpen = menu.classList.contains('show');

        // cerrar todos
        document.querySelectorAll('.submenu').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.has-submenu').forEach(i => i.classList.remove('active'));

        if (!isOpen) {
            menu.classList.add('show');
            item.classList.add('active');
        }

    });
});

// VELOCIDAD
document.querySelectorAll('#speed-menu .menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const speed = parseFloat(item.dataset.speed);
        video.playbackRate = speed;

        document.querySelectorAll('#speed-menu .menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// CALIDAD
document.querySelectorAll('#quality-menu .menu-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('#quality-menu .menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        qualityMenu.classList.remove('active');
        mainMenu.classList.add('active');
    });
});

// Mostrar UI al mover mouse

let cursorTimeout;
videoContainer.addEventListener('mousemove', () => {
    if (!document.fullscreenElement) return;

    // mostrar cursor
    videoContainer.classList.remove('hide-cursor');
    videoContainer.classList.add('show-ui');

    clearTimeout(uiTimeout);
    clearTimeout(cursorTimeout);

    // ocultar UI
    uiTimeout = setTimeout(() => {
        videoContainer.classList.remove('show-ui');
        settingsMenu.classList.remove('show');
        volumeBar.classList.remove('show');
    }, 2000);

    cursorTimeout = setTimeout(() => {
        videoContainer.classList.add('hide-cursor');
    }, 2000);
});

video.addEventListener('play', () => {
    if (document.fullscreenElement) {
        videoContainer.classList.remove('show-ui');
    }
});

/*ATAJO TECLADOS*/
document.addEventListener('keydown', (e) => {
    if (modalSphere.style.display === "flex") return;
    const isHoveringVideo = videoContainer.matches(':hover');
    if (!isHoveringVideo) return;

    if (e.code === 'Space') {
        e.preventDefault();
        video.paused ? video.play() : video.pause();
    }

    function updateVolumeIcon() {
        if (video.muted || video.volume === 0) {
            volumeIcon.className = 'fa-solid fa-volume-xmark';
        } else if (video.volume <= 0.3) {
            volumeIcon.className = 'fa-solid fa-volume-off';
        } else if (video.volume <= 0.7) {
            volumeIcon.className = 'fa-solid fa-volume-low';
        } else {
            volumeIcon.className = 'fa-solid fa-volume-high';
        }
    }

    if (e.code === 'ArrowRight') video.currentTime += 10;
    if (e.code === 'ArrowLeft') video.currentTime -= 10;
    if (e.code === 'KeyM') {
        video.muted = !video.muted;
        updateVolumeIcon();
    }
    if (e.code === 'KeyF') {
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
});

/*FORMATO DE TIEMPO*/
function formatTime(time) {
    if (!time || isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
