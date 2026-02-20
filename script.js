gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {

  // =============================
  // Loader Animation (optional)
  // =============================
  const tl = gsap.timeline();

  tl.set(".loader-container", { autoAlpha: 1 })
    .to({}, { duration: 1 })
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
    .from(
      ".nav img, .nav h4, .hero-image, .floating, .fill-btn",
      {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      }
    );

  // =============================
  // HORIZONTAL SCROLL SECTION
  // =============================
  const container = document.querySelector(".keydivs");
  const section = document.querySelector(".page2");

  if (!container || !section) return;

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
      invalidateOnRefresh: true,
    },
  });

});