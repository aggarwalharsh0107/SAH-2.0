gsap.registerPlugin(ScrollTrigger);

// Locomotive Scroll
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

// INTRO ANIMATION
gsap.from(".nav img, .nav h4, #hero-h1, #hero-h3, .hero-button, .main-image", {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out"
});

// HERO SCROLL ANIMATION
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
    .to(".main-image", { x: 800 }, "move")
    .to(".hero-img", { width: "100%" });

// PAGE 2 ANIMATIONS
gsap.from(".page2-h1, .box , .box h1 , .box p", {
    opacity: 0,
    y: 100,
    scale: 1,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".hero-img",
        scroller: ".main",
        start: "top 80%",
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
        trigger: ".hero-img",
        scroller: ".main",
        start: "top -10%",
        end: "top -20%",
        scrub: 2
    }
});
