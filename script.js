const header = document.getElementById("header");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

// 1. Loading Screen Fade Out
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.style.display = "none";
    }, 500); // matches CSS transition duration
  }
});

// Sticky header shadow
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

// Mobile menu
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("open");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");
const navItems = navLinks.querySelectorAll("a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((item) => {
          item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => observer.observe(section));

// Fade-in on scroll
const fadeElements = document.querySelectorAll(
  ".section-title, .about-grid, .skill-card, .project-card, .contact-form, .contact-links"
);

fadeElements.forEach((el) => el.classList.add("fade-in"));

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeElements.forEach((el) => fadeObserver.observe(el));

// Contact form (demo)
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector("button[type=submit]");
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        formNote.textContent = "Pesan berhasil dikirim!";
        formNote.style.color = "#4ade80";
        formNote.hidden = false;
        contactForm.reset();
      } else {
        formNote.textContent = data.error || "Gagal mengirim pesan. Coba lagi.";
        formNote.style.color = "#f87171";
        formNote.hidden = false;
      }
    } catch (err) {
      formNote.textContent = "Terjadi kesalahan jaringan. Coba lagi.";
      formNote.style.color = "#f87171";
      formNote.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
      setTimeout(() => { formNote.hidden = true; }, 5000);
    }
  });
}

// 2. Cursor Spotlight Tracker
const spotlight = document.getElementById("cursorSpotlight");
window.addEventListener("mousemove", (e) => {
  if (spotlight) {
    spotlight.style.setProperty("--mouse-x", `${e.clientX}px`);
    spotlight.style.setProperty("--mouse-y", `${e.clientY}px`);
  }
});

// 3. Typewriter Effect
const typewriterSpan = document.getElementById("typewriter-text");
const phrases = ["Web Developer", "Creative Builder", "Problem Solver", "UI/UX Design Enthusiast", "Full-Stack Developer"];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
  if (!typewriterSpan) return;

  const currentPhrase = phrases[phraseIdx];

  if (isDeleting) {
    typewriterSpan.textContent = currentPhrase.substring(0, charIdx - 1);
    charIdx--;
    typeSpeed = 50; // speed up deleting
  } else {
    typewriterSpan.textContent = currentPhrase.substring(0, charIdx + 1);
    charIdx++;
    typeSpeed = 100; // standard typing speed
  }

  if (!isDeleting && charIdx === currentPhrase.length) {
    isDeleting = true;
    typeSpeed = 2000; // pause at end of phrase
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    typeSpeed = 500; // pause before typing next
  }

  setTimeout(typeWriter, typeSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(typeWriter, 1000);
});

// 4. Scroll To Top Button
const scrollTopBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  if (scrollTopBtn) {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// 5. Canvas Particle Background System
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  const colors = ["rgba(108, 99, 255, 0.4)", "rgba(0, 210, 255, 0.35)", "rgba(255, 255, 255, 0.15)"];

  // Mouse position tracker for particles
  const mouse = {
    x: null,
    y: null,
    radius: 120 // area of interaction
  };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle Resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener("resize", resizeCanvas);
  
  // Set dimensions initially
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Particle Class
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    // Draw particle
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    // Update particle position & collision
    update() {
      // Bounce off borders
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Check mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size) {
          // Push particles slightly away
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 1.5;
          const directionY = forceDirectionY * force * 1.5;

          this.x -= directionX;
          this.y -= directionY;
        }
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  // Populate particle array
  function initParticles() {
    particlesArray = [];
    // Number of particles depends on screen width
    let numberOfParticles = (canvas.width * canvas.height) / 11000;
    numberOfParticles = Math.min(numberOfParticles, 120); // Cap it for performance

    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2.5 + 0.5;
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      let color = colors[Math.floor(Math.random() * colors.length)];

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Connect particles close to each other
  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          opacityValue = 1 - (distance / 100);
          ctx.strokeStyle = `rgba(108, 99, 255, ${opacityValue * 0.12})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
  }

  // Start Simulation
  initParticles();
  animate();
}
