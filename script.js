gsap.registerPlugin(ScrollTrigger);
initSite();


window.addEventListener("load", () => {

  const master = gsap.timeline();

  master
    /* ===== LOADER PHASE ===== */

    .set(".loader-container", { autoAlpha: 1 })

    // wait for CSS text fill animation
    .to({}, { duration: 2.5 })

    // loader text fades up
    .to(".loader-text-fill", {
      y: -60,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    })

    // loader slides up
    .to(".loader-container", {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut"
    }, "-=0.2")

    // page rises with loader
    .from(".main", {
      y: 120,
      duration: 0.9,
      ease: "power4.out"
    }, "<")

    // remove loader from DOM flow
    .set(".loader-container", { display: "none" })

    /* ===== INIT SITE ===== */
    

    /* ===== INTRO ANIMATION (SYNCED) ===== */
    .from(".nav img, .nav h4, #hero-h1, #hero-h3, .hero-button, .main-image", {
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=0.4");

});


/* ================= SITE INIT ================= */

function initSite() {

  const locoScroll = new LocomotiveScroll({
      el: document.querySelector(".main"),
      smooth: true
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(".main", {
      scrollTop(value) {
          return arguments.length
              ? locoScroll.scrollTo(value, 0, 0)
              : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.querySelector(".main").style.transform ? "transform" : "fixed"
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();

  /* HERO SCROLL */
  const tl = gsap.timeline({
      scrollTrigger: {
          trigger: ".page1",
          scroller: ".main",
          start: "top top",
          end: "bottom top",
          scrub: 2
      }
  });

  tl.to("#hero-h1, #hero-h3, .hero-button", { x: -800 }, "move")
    .to(".main-image", { x: 800 }, "move");

  /* PAGE 2 */
  gsap.from(".page2-h1, .box , .box h1 , .box p", {
      opacity: 0,
      y: 100,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
          trigger: ".page2-container",
          scroller: ".main",
          start: "top 60%",
          end: "top 20%",
          scrub: 2
      }
  });

  gsap.from(".box2 , .box2 h1, .box2 p", {
      opacity: 0,
      y: 100,
      scale: 0.9,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
          trigger: ".page2-container",
          scroller: ".main",
          start: "top 5%",
          end: "top -20%",
          scrub: 2
      }
  });

}
