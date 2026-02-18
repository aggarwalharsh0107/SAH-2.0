gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {

  const tl = gsap.timeline();

  tl
    // loader visible
    .set(".loader-container", { autoAlpha: 1 })

    // fake load
    .to({}, { duration: 1.8 })

    // loader text exit
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

    // 🔥 HERO ENTERS AT SAME TIME
    .from(
      ".nav img, .nav h4, .hero-image, .floating, .text1, .text2, .text3, .text4, .fill-btn",
      {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out"
      },
      "-=0.4"   // overlaps with loader exit
    )

    // loader removed
    .set(".loader-container", { display: "none" })

    // button fill after hero visible
    .to(".fill-btn .fill", {
      scaleX: 1,
      duration: 1.1,
      ease: "power3.out",
      transformOrigin: "left"
    }, "-=0.5")

    // label color change
    .add(() => {
      document.querySelector(".fill-btn")?.classList.add("filled");
    });

});
