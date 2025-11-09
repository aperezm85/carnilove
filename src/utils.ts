import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export const animateTitle = ({
  title,
  trigger,
  start = "top 50%",
  end = "bottom 40%",
}: {
  title: HTMLElement | null;
  trigger?: string | HTMLElement | null;
  start?: string;
  end?: string;
}) => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  if (title) {
    // Run SplitText only after fonts are loaded to ensure correct measurements.
    const initSplitText = () => {
      // If SplitText was already applied, kill previous instance (defensive)
      try {
        // Create SplitText on the actual element node rather than a string selector
        const mySplitText = new SplitText(title, { type: "chars" });
        const chars = mySplitText.chars;

        gsap.from(chars, {
          yPercent: 200,
          stagger: 0.02,
          ease: "back.out",
          duration: 1,
          scrollTrigger: {
            trigger: trigger || title,
            start: start,
            end: end,
            toggleActions: "play reverse restart restart",
          },
        });
      } catch (err) {
        // If SplitText fails for any reason, log and bail gracefully
        console.warn("SplitText init failed:", err);
      }
    };

    if (document.fonts && document.fonts.ready) {
      // Wait for all fonts declared in CSS to be loaded
      document.fonts.ready.then(initSplitText).catch(initSplitText);
    } else {
      // Fallback: wait for window load
      window.addEventListener("load", initSplitText, { once: true });
    }
  }
};
