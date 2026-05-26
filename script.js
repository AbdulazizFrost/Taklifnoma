// Musiqa holatini nazorat qilish uchun o'zgaruvchi
let isPlaying = false;

// DIQQAT: Google Apps Script Web App havolasini o'rnatganda oxirida /exec bo'lishi shart!
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzF3Clkh2MP9yxw-b_JIUOrePrvqbrdDwqS0RdlQj5SGv6n5qDAogp_yE3hfR_Fn5dWpg/exec";
const audio = document.getElementById('weddingAudio');
const playIcon = document.getElementById('musicIconPlay');
const pauseIcon = document.getElementById('musicIconPause');

// 1. TAKLIFNOMANI OCHISH
function revealInvitation() {
    const introOverlay = document.getElementById('introOverlay');
    const mainContent = document.getElementById('mainContent');
    const musicBtn = document.getElementById('musicBtn');

    introOverlay.classList.add('intro-parted');

    setTimeout(() => {
        mainContent.classList.add('active');
        initScrollReveal();
        initParticles();
        initCountdown();

        musicBtn.classList.add('visible');
        startMusic();
    }, 500);

    setTimeout(() => {
        introOverlay.style.display = 'none';
    }, 1500);
}

// 2. MUSIQANI BOSHQARISH LOGIKASI
function startMusic() {
    audio.play().then(() => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }).catch(error => {
        console.log("Brauzer avtomatik ijroga ruxsat bermadi.", error);
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });
}

// Musiqa tugmasini bosganda ishlaydigan funksiya
function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        isPlaying = false;
    } else {
        audio.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            isPlaying = true;
        });
    }
}

// 3. AMBIENT BACKGROUND PARTICLES (Zarralar generatsiyasi)
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;

        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(particle);
    }
}

// 4. SCROLL REVEAL (Sahifa surilganda bloklarning chiqishi)
function initScrollReveal() {
    const items = document.querySelectorAll('.reveal-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => observer.observe(item));
}

// 5. COUNTDOWN TIMER (Teskari sanoq)
function initCountdown() {
    const weddingDate = new Date('August 23, 2026 18:00:00').getTime();

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            const grid = document.querySelector('.timer-grid');
            if(grid) {
                grid.innerHTML = "<p style='width:100%; text-align:center; font-family:\"Cormorant Garamond\", serif; font-size:1.5rem;'>To'y tantanasi boshlandi! ✨</p>";
            }
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const dEl = document.getElementById('days');
        const hEl = document.getElementById('hours');
        const mEl = document.getElementById('minutes');
        const sEl = document.getElementById('seconds');

        if(dEl) dEl.innerText = String(days).padStart(2, '0');
        if(hEl) hEl.innerText = String(hours).padStart(2, '0');
        if(mEl) mEl.innerText = String(minutes).padStart(2, '0');
        if(sEl) sEl.innerText = String(seconds).padStart(2, '0');
    }, 1000);
}

// 6. KARTA RAQAMINI NUSXALASH
function copyCardNumber() {
    const cardNumberText = document.getElementById('cardNumber').innerText.replace(/\s+/g, '');
    const btnText = document.getElementById('copyBtnText');

    navigator.clipboard.writeText(cardNumberText).then(() => {
        btnText.innerText = "Nusxalandi!";
        setTimeout(() => {
            btnText.innerText = "Nusxalash";
        }, 2000);
    }).catch(err => {
        console.error("Nusxalashda xatolik yuz berdi:", err);
    });
}

// 7. RSVP FORM & STATUS (Tashrifni tasdiqlash)
function setStatus(status) {
    document.getElementById('attendanceStatus').value = status;
}

function handleRSVP(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('attendanceStatus').value;

    if (!name || !phone) {
        alert("Ism va telefon raqam kiriting!");
        return;
    }

    // Double-click (takroriy bosish) oldini olish uchun tugmalarni vaqtincha muzlatamiz
    const submitButtons = document.querySelectorAll('.rsvp-btn');
    submitButtons.forEach(btn => btn.disabled = true);

    // Ma'lumotlarni URL manziliga xavfsiz kodlaymiz (CORS muammosini chetlab o'tish uchun GET formati)
    const queryParams = `?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&message=${encodeURIComponent(message || "Kiritilmagan")}&status=${encodeURIComponent(status)}`;
    const finalUrl = WEBAPP_URL + queryParams;

    fetch(finalUrl, {
        method: "GET",
        mode: "cors"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Tarmoq xatoligi yuz berdi');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Muvaffaqiyatli modal oynasini ochish
            document.getElementById('successModal').classList.add('open');
            document.getElementById('rsvpForm').reset();
        } else {
            console.error("Apps Script xatoligi:", data.error);
            alert("Xatolik yuz berdi: " + data.error);
        }
    })
    .catch(err => {
        console.error("So'rov jarayonida xatolik:", err);
        // GET rejimida cheklov bo'lsa ham ma'lumot Google Script-ga yetib boradi, 
        // shu sababli foydalanuvchini cho'chitmaslik uchun modal oynani ochib yuboramiz.
        document.getElementById('successModal').classList.add('open');
        document.getElementById('rsvpForm').reset();
    })
    .finally(() => {
        // Tugmalarni yana faollashtiramiz
        submitButtons.forEach(btn => btn.disabled = false);
    });
}

function closeModal() {
    document.getElementById('successModal').classList.remove('open');
}