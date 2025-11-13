import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Cached promise that resolves when fonts are ready (or on window load as a fallback)
export const fontsReady: Promise<void> =
  typeof document !== "undefined" &&
  (document as any).fonts &&
  (document as any).fonts.ready
    ? (document as any).fonts.ready
    : new Promise((resolve) => {
        if (typeof window === "undefined") return resolve();
        window.addEventListener("load", () => resolve(), { once: true });
      });

export const ensureFontsReady = () => fontsReady;

// Helper that waits for fonts and returns a new SplitText instance
export const safeSplitText = async (target: Element | null, opts?: any) => {
  await fontsReady;
  return new SplitText(target as any, opts);
};

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
          opacity: 0,
          ease: "back.out",
          // duration: 1,
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

export const animateLabel = (
  tl: gsap.core.Timeline,
  label: HTMLElement | null
) => {
  if (!tl) throw new Error("Timeline is required for animateLabel");
  if (!label) return tl;
  return tl.fromTo(
    label,
    { opacity: 0, y: -20 },
    {
      opacity: 1,
      y: 0,
      // duration: 0.5,
      ease: "power2.out",
    }
  );
};

export const animateTextLabel = (
  label: HTMLElement | null,
  reverse: boolean = false
) => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  if (!label) return;
  const initSplitText = () => {
    const splittedText = new SplitText(label, { type: "line,words" });

    const chars = splittedText.words;

    if (!reverse) {
      gsap.fromTo(
        chars,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
        }
      );
    } else {
      gsap.fromTo(
        chars,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -100,
          opacity: 0,
          stagger: 0.1,
        }
      );
    }
  };

  if (document.fonts && document.fonts.ready) {
    // Wait for all fonts declared in CSS to be loaded
    document.fonts.ready.then(initSplitText).catch(initSplitText);
  } else {
    // Fallback: wait for window load
    window.addEventListener("load", initSplitText, { once: true });
  }
};

export const animationTextBottom = (
  label: HTMLElement | null,
  timeline: gsap.core.Timeline
) => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  if (!label || !timeline) return;
  const initSplitText = () => {
    const splittedTextLabel = new SplitText(label, { type: "line,words" });

    timeline.fromTo(
      splittedTextLabel.words,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
      }
    );

    return timeline;
  };

  if (document.fonts && document.fonts.ready) {
    // Wait for all fonts declared in CSS to be loaded
    document.fonts.ready.then(initSplitText).catch(initSplitText);
  } else {
    // Fallback: wait for window load
    window.addEventListener("load", initSplitText, { once: true });
  }
};
