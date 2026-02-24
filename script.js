/* ================= GSAP SETUP ================= */
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/* ================= LOADER ================= */
document.addEventListener("DOMContentLoaded", () => {

  const tl = gsap.timeline({
    onComplete: initSmoothScroll // start smoother AFTER loader
  });

  tl.set(".loader-container", { autoAlpha: 1 })
    .to({}, { duration: 0.8 })
    .to(".loader-text-fill", {
      y: -60,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    })
    .to(".loader-container", {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut",
    })
    .set(".loader-container", { display: "none" })
    .from(".nav img, .nav h4, .floating, .fill-btn", {
      y: 80,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
    });

});

/* ================= SCROLL SMOOTHER ================= */
function initSmoothScroll() {
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.2,
    effects: true,
    normalizeScroll: true
  });

  initAnimations(); // start scroll animations
}

/* ================= SCROLL ANIMATIONS ================= */
function initAnimations() {

  /* ABOUT SECTION */
  gsap.set(".small-title", { opacity: 0, y: 40 });
  gsap.set(".about-text h1", { opacity: 0, y: 60 });
  gsap.set(".description", { opacity: 0, y: 40 });
  gsap.set(".card", { opacity: 0, y: 60 });

  const aboutTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".about",
      start: "top 70%",
      toggleActions: "play reverse play reverse",
    }
  });

  aboutTimeline
    .to(".small-title", { opacity: 1, y: 0, duration: 0.6 })
    .to(".about-text h1", { opacity: 1, y: 0, duration: 0.8 }, "-=0.2")
    .to(".description", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");

  gsap.to(".card", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about",
      start: "top 60%",
    }
  });

  /* PAGE 2 HORIZONTAL SCROLL */
  const container = document.querySelector(".keydivs");
  const section = document.querySelector(".page2");

  if (container && section) {
    const scrollAmount = container.scrollWidth - window.innerWidth;

    gsap.to(container, {
      x: -scrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + scrollAmount,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    gsap.from(".page2-text-left h1, .page2-text-right p", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".page2",
        start: "top 70%",
      }
    });

    gsap.from(".key-box", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".page2",
        start: "top 60%",
      }
    });
  }

  /* UPLOAD SECTION */
  gsap.from(".upload-box", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".upload-section",
      start: "top 70%",
    }
  });

  /* CONTACT */
  gsap.from(".contact-content, .contact-btn", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".contact",
      start: "top 70%",
    }
  });

  /* SERVICES & CLIENTS */
  gsap.from(".services, .clients", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".services",
      start: "top 80%",
    }
  });

  ScrollTrigger.refresh();
}

/* ================= PROFILE DROPDOWN ================= */
const avatar = document.querySelector(".avatar");
const dropdown = document.querySelector(".dropdown");

if (avatar) {
  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile")) {
      dropdown.style.display = "none";
    }
  });
}

/* ================= LOGIN STATE ================= */
document.addEventListener("DOMContentLoaded", () => {
  const profile = document.getElementById("profileCircle");
  const btn = document.querySelector(".fill-btn");

  const params = new URLSearchParams(window.location.search);

  if (params.get("login") === "success") {
    localStorage.setItem("isLoggedIn", "true");
    window.history.replaceState({}, document.title, "/");
  }

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (profile && btn) {
    if (isLoggedIn === "true") {
      profile.style.display = "flex";
      btn.style.display = "none";
    } else {
      profile.style.display = "none";
      btn.style.display = "inline-block";
    }
  }
});

/* ================= LOGOUT ================= */

// logout button click
document.getElementById("logoutBtn").addEventListener("click", () => {
  fetch("/logout")
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => console.log("Logout error:", err));
});
function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/login";
}

/* ================= FILE UPLOAD ================= */
const fileInput = document.getElementById("fileInput");
const browse = document.querySelector(".browse");
const fileList = document.getElementById("fileList");

if (browse && fileInput) {
  browse.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    fileList.innerHTML = "";

    Array.from(fileInput.files).forEach(file => {
      const fileItem = document.createElement("div");
      fileItem.className = "file-item";

      fileItem.innerHTML = `
        <div style="color:black;">${file.name}</div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      `;

      fileList.appendChild(fileItem);

      const progressFill = fileItem.querySelector(".progress-fill");

      const formData = new FormData();
      formData.append("files", file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          progressFill.style.width = percent + "%";
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          progressFill.style.width = "100%";
        }
      };

      xhr.open("POST", "/upload");
      xhr.send(formData);
    });
  });
}