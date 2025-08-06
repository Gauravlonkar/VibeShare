
// Initialize Lenis
const lenis = new Lenis(

    {
        duration: 11.2,
        // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    }
);

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
    console.log(e);
});

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);