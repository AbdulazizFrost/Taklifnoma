// Musiqa holatini nazorat qilish uchun o'zgaruvchi
let isPlaying = false;

const audio = document.getElementById('weddingAudio');
const playIcon = document.getElementById('musicIconPlay');
const pauseIcon = document.getElementById('musicIconPause');

// 1. TAKLIFNOMANI OCHISH
function revealInvitation() {
    const introOverlay = document.getElementById('introOverlay');
    const mainContent = document.getElementById('mainContent');
    const musicBtn = document.getElementById('musicBtn');

    // Bulutli ekranga animatsiya qo'shish orqali yashirish
    introOverlay.classList.add('intro-parted');
    
    // Asosiy kontentni ko'rsatish
    setTimeout(() => {
        mainContent.classList.add('active');
        
        // Skroll effektlari va zarralarni ishga tushirish
        initScrollReveal();
        initParticles();
        initCountdown();
        
        // Musiqa tugmasini ko'rsatish va musiqani ijro etish
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
        console.log("Brauzer avtomatik ijroga ruxsat bermadi. Foydalanuvchi bosishi kutilmoqda.", error);
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });
}

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
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Tasodifiy o'lcham va pozitsiya
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        
        // Tasodifiy animatsiya vaqti va kechikishi
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
    // To'y sanasi: 2026-yil 23-avgust, 18:00
    const weddingDate = new Date('August 23, 2026 18:00:00').getTime();

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            document.querySelector('.timer-grid').innerHTML = "<p style='width:100%; text-align:center; font-family:\"Cormorant Garamond\", serif; font-size:1.5rem;'>To'y tantanasi boshlandi! ✨</p>";
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
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
    const form = document.getElementById('rsvpForm');
    const status = document.getElementById('attendanceStatus').value;
    const modalMessage = document.getElementById('modalMessage');

    // FormSubmit xizmatiga ma'lumotlarni yuborish
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            if (status === 'Albatta Boraman') {
                modalMessage.innerText = "Katta rahmat! Sizni to'yimizda kutib qolamiz. ✨";
            } else {
                modalMessage.innerText = "Bildirgan javobingiz uchun rahmat. Sizni duoingiz biz uchun muhim. 🙏";
            }
            document.getElementById('successModal').classList.add('open');
            form.reset();
        } else {
            alert("Xatolik yuz berdi, iltimos qaytadan urinib ko'ring.");
        }
    }).catch(error => {
        console.error("Xatolik:", error);
        alert("Tarmoq xatosi yuz berdi.");
    });
}

function closeModal() {
    document.getElementById('successModal').classList.remove('open');
}