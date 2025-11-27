/**
 * Scroll Controller
 *
 * Implements scroll-hijacking to snap between sections.
 * - Scroll down triggers next section to animate in
 * - Tall sections allow internal scrolling before transitioning
 * - Exit animations play visibly before section transitions
 */

import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initBackgroundManager, updateBackground } from "./background-manager";
import { getEntryAnimation, getExitAnimation } from "./entryAnimation";

// import { initBackgroundManager } from "./background-manager";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Observer);

interface SectionConfig {
  element: HTMLElement;
  id: string;
  // hasExitAnimation: boolean;
  bgPosition: { x?: number; y?: number; scale?: number; opacity?: number }[];
  isTall: boolean;
  scrollableContent: HTMLElement | null;
}

interface ScrollControllerState {
  sections: SectionConfig[];
  currentIndex: number;
  isAnimating: boolean;
  observer: Observer | null;
}

const state: ScrollControllerState = {
  sections: [],
  currentIndex: 0,
  isAnimating: false,
  observer: null,
};

// Animation settings
const TRANSITION_DURATION = 0.9;
const EXIT_ANIMATION_DURATION = 0.5;
const TRANSITION_EASE = "power2.inOut";

/**
 * Parse section configuration from DOM element
 */
function parseSectionConfig(element: HTMLElement): SectionConfig {
  const content = element.querySelector(".section-content") as HTMLElement;

  const isTall =
    element.classList.contains("parallax-section--tall") ||
    (content && content.scrollHeight > window.innerHeight * 0.9);

  const bgPosition = JSON.parse(
    element.dataset.bgPosition ||
      '[{"x":0,"y":0,"scale":1, "opacity":1},{"x":0,"y":0,"scale":1, "opacity":1},{"x":0,"y":0,"scale":1, "opacity":1}]'
  );

  return {
    element,
    id: element.dataset.sectionId || "",
    bgPosition: bgPosition.map(
      (pos: { x?: number; y?: number; scale?: number; opacity?: number }) => ({
        x: pos.x !== undefined ? pos.x : 0,
        y: pos.y !== undefined ? pos.y : 0,
        scale: pos.scale !== undefined ? pos.scale : 1,
        opacity: pos.opacity !== undefined ? pos.opacity : 1,
      })
    ),
    isTall,
    scrollableContent: isTall ? content : null,
  };
}

/**
 * Check if tall section can scroll more in given direction
 */
function canTallSectionScroll(
  section: SectionConfig,
  direction: "up" | "down"
): boolean {
  if (!section.isTall) return false;

  const el = section.scrollableContent || section.element;
  const scrollTop = (el as HTMLElement).scrollTop;
  const scrollHeight = (el as HTMLElement).scrollHeight;
  const clientHeight = (el as HTMLElement).clientHeight;

  if (direction === "down") {
    // Can scroll down if not at bottom
    return scrollTop + clientHeight < scrollHeight - 10;
  } else {
    // Can scroll up if not at top
    return scrollTop > 10;
  }
}

/**
 * Set initial positions for all sections
 */
function setInitialPositions(): void {
  state.sections.forEach((section, index) => {
    const baseStyles = {
      position: "fixed",
      left: 0,
      width: "100%",
      zIndex: state.sections.length - index,
      visibility: "visible",
    };

    if (section.isTall) {
      gsap.set(section.element, {
        ...baseStyles,
        top: index === 0 ? 0 : "100%",
        height: "100vh",
        overflowY: "hidden",
      });
      // Make the inner content the scrollable area
      const contentEl =
        section.scrollableContent ||
        section.element.querySelector(".section-content");
      if (contentEl) {
        gsap.set(contentEl as HTMLElement, {
          height: "100vh",
          overflowY: "auto",
        });
        // ensure the state knows about the scrollableContent reference
        section.scrollableContent = contentEl as HTMLElement;
      }
    } else {
      gsap.set(section.element, {
        ...baseStyles,
        top: index === 0 ? 0 : "100%",
        height: "100vh",
        overflowY: "hidden",
      });
    }
  });

  // Set initial animated elements state
  if (state.sections[0].element.querySelectorAll(".animate-item").length > 0) {
    gsap.set(".animate-item", {
      opacity: 0,
      y: 40,
    });
  }

  // Animate first section entry
  const firstSection = state.sections[0];
  if (firstSection) {
    updateBackground(firstSection.id, firstSection.bgPosition);
    const entryTl = getEntryAnimation(firstSection.element);
    entryTl.play();
  }
}

/**
 * Play exit animation and wait for it to complete
 */
function playExitAnimationAsync(section: SectionConfig): Promise<void> {
  return new Promise((resolve) => {
    const exitTl = getExitAnimation(section.element);
    exitTl.eventCallback("onComplete", () => {
      resolve();
    });
    exitTl.play();
  });
}

/**
 * Go to next section
 */
async function goToNextSection(): Promise<void> {
  if (state.isAnimating) return;
  if (state.currentIndex >= state.sections.length - 1) return;

  const currentSection = state.sections[state.currentIndex];
  const nextSection = state.sections[state.currentIndex + 1];

  // Check if tall section needs to scroll first
  if (canTallSectionScroll(currentSection, "down")) {
    // Let the section scroll naturally (use inner scrollable if present)
    const el = currentSection.scrollableContent || currentSection.element;
    (el as HTMLElement).scrollBy({ top: 10, behavior: "smooth" });
    return;
  }

  state.isAnimating = true;

  // Step 1: Play exit animation FIRST and wait for it
  await playExitAnimationAsync(currentSection);
  // Small pause after exit animation
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Step 2: Now transition sections
  const tl = gsap.timeline({
    onComplete: () => {
      state.currentIndex++;
      state.isAnimating = false;
      updateProgressBar();
    },
  });

  // Animate current section up and out
  tl.to(
    currentSection.element,
    {
      top: "-100%",
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    },
    0
  );

  // Animate next section up into view
  tl.to(
    nextSection.element,
    {
      top: "0%",
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    },
    0
  );

  // Update background mid-transition
  tl.call(
    () => {
      updateBackground(nextSection.id, nextSection.bgPosition);
    },
    [],
    TRANSITION_DURATION * 0.3
  );

  // Play entry animation on next section
  tl.call(
    () => {
      // Reset animated items in next section first
      if (nextSection.element.querySelectorAll(".animate-item").length > 0) {
        gsap.set(nextSection.element.querySelectorAll(".animate-item"), {
          opacity: 0,
          y: 40,
        });
      }
      // Reset scroll position for tall sections
      if (nextSection.isTall) {
        const resetEl = nextSection.scrollableContent || nextSection.element;
        (resetEl as HTMLElement).scrollTop = 0;
      }
      const entryTl = getEntryAnimation(nextSection.element);
      entryTl.play();
    },
    [],
    TRANSITION_DURATION * 0.4
  );
}

/**
 * Go to previous section
 */
async function goToPreviousSection(): Promise<void> {
  if (state.isAnimating) return;
  if (state.currentIndex <= 0) return;

  const currentSection = state.sections[state.currentIndex];
  const prevSection = state.sections[state.currentIndex - 1];

  // Check if tall section needs to scroll first
  if (canTallSectionScroll(currentSection, "up")) {
    // Let the section scroll naturally (use inner scrollable if present)
    const el = currentSection.scrollableContent || currentSection.element;
    (el as HTMLElement).scrollBy({ top: -10, behavior: "smooth" });
    return;
  }

  state.isAnimating = true;

  await playExitAnimationAsync(currentSection);
  await new Promise((resolve) => setTimeout(resolve, 100));

  const tl = gsap.timeline({
    onComplete: () => {
      state.currentIndex--;
      state.isAnimating = false;
      updateProgressBar();
    },
  });

  // Animate current section down and out
  tl.to(
    currentSection.element,
    {
      top: "100%",
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    },
    0
  );

  // Animate previous section down into view
  tl.to(
    prevSection.element,
    {
      top: "0%",
      duration: TRANSITION_DURATION,
      ease: TRANSITION_EASE,
    },
    0
  );

  // Update background
  tl.call(
    () => {
      updateBackground(prevSection.id, prevSection.bgPosition);
    },
    [],
    TRANSITION_DURATION * 0.3
  );

  // Play entry animation on previous section
  tl.call(
    () => {
      // Reset animated items
      if (prevSection.element.querySelectorAll(".animate-item").length > 0) {
        gsap.set(prevSection.element.querySelectorAll(".animate-item"), {
          opacity: 0,
          y: 40,
        });
      }
      const entryTl = getEntryAnimation(prevSection.element);
      entryTl.play();
    },
    [],
    TRANSITION_DURATION * 0.4
  );
}

/**
 * Handle scroll/swipe input
 */
function handleScrollInput(direction: "up" | "down"): void {
  if (direction === "down") {
    goToNextSection();
  } else {
    goToPreviousSection();
  }
}

/**
 * Initialize scroll observer
 */
function initObserver(): void {
  if (state.observer) {
    state.observer.kill();
  }

  state.observer = Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    // Do not preventDefault globally; we'll only prevent when we actually hijack navigation
    preventDefault: false,
    tolerance: 10,
    onDown: (self: any) => {
      const current = state.sections[state.currentIndex];
      const shouldNavigate = !canTallSectionScroll(current, "up");
      if (shouldNavigate) {
        // prevent native scroll only when we're about to navigate
        if (self && self.event && self.event.preventDefault)
          self.event.preventDefault();
        handleScrollInput("up");
      }
    },
    onUp: (self: any) => {
      const current = state.sections[state.currentIndex];
      const shouldNavigate = !canTallSectionScroll(current, "down");
      if (shouldNavigate) {
        if (self && self.event && self.event.preventDefault)
          self.event.preventDefault();
        handleScrollInput("down");
      }
    },
  });
}

/**
 * Initialize keyboard navigation
 */
function initKeyboardNav(): void {
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      handleScrollInput("down");
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      handleScrollInput("up");
    }
  });
}

/**
 * Create progress bar
 */
function createProgressBar(): void {
  const progress = document.createElement("div");
  progress.className =
    "fixed top-0 left-0 h-[3px] bg-linear-to-r from-text-primary to-text-minimal z-9999 origin-left transition-transform duration-300 ease";
  progress.id = "scroll-progress";
  document.body.appendChild(progress);
  updateProgressBar();
}

/**
 * Update progress bar based on current section
 */
function updateProgressBar(): void {
  const progress = document.getElementById("scroll-progress");
  if (!progress) return;

  const percentage = ((state.currentIndex + 1) / state.sections.length) * 100;
  progress.style.width = `${percentage}%`;
}

/**
 * Main initialization function
 */
export function initScrollController(): void {
  // Initialize background manager
  initBackgroundManager();

  // Parse all sections
  const sectionElements =
    document.querySelectorAll<HTMLElement>(".parallax-section");
  sectionElements.forEach((element) => {
    const config = parseSectionConfig(element);
    state.sections.push(config);
  });

  if (state.sections.length === 0) {
    console.warn("No sections found");
    return;
  }

  // Prevent default scroll on body
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  // Set initial positions
  setInitialPositions();

  // Initialize observer for scroll/touch
  initObserver();

  // Initialize keyboard navigation
  initKeyboardNav();

  // Create progress bar
  createProgressBar();

  console.log(
    "Scroll controller initialized with",
    state.sections.length,
    "sections"
  );
  console.log(
    "Tall sections:",
    state.sections.filter((s) => s.isTall).map((s) => s.id)
  );
}

/**
 * Cleanup function
 */
export function destroyScrollController(): void {
  if (state.observer) {
    state.observer.kill();
  }

  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";

  const nav = document.querySelector(".section-nav");
  if (nav) nav.remove();

  const progress = document.getElementById("scroll-progress");
  if (progress) progress.remove();

  state.sections = [];
  state.currentIndex = 0;
  state.isAnimating = false;
}
