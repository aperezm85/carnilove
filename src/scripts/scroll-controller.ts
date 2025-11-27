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
import { getEntryAnimation, getExitAnimation } from "./entryAnimation";

// import { initBackgroundManager } from "./background-manager";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Observer);

interface SectionConfig {
  element: HTMLElement;
  id: string;
  // hasExitAnimation: boolean;
  bgPosition: { x: number; y: number; scale: number };
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

  return {
    element,
    id: element.dataset.sectionId || "",
    bgPosition: JSON.parse(
      element.dataset.bgPosition || '{"x":0,"y":0,"scale":1}'
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
  if (!section.isTall || !section.scrollableContent) return false;

  const el = section.element;
  const scrollTop = el.scrollTop;
  const scrollHeight = el.scrollHeight;
  const clientHeight = el.clientHeight;

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
        overflowY: "auto",
      });
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
    // updateBackground(firstSection.id, firstSection.bgPosition);
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
    // Let the section scroll naturally
    currentSection.element.scrollBy({ top: 150, behavior: "smooth" });
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
      // updateNavigationDots();
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
      // updateBackground(nextSection.id, nextSection.bgPosition);
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
        nextSection.element.scrollTop = 0;
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
    // Let the section scroll naturally
    currentSection.element.scrollBy({ top: -150, behavior: "smooth" });
    return;
  }

  state.isAnimating = true;

  await playExitAnimationAsync(currentSection);
  await new Promise((resolve) => setTimeout(resolve, 100));

  const tl = gsap.timeline({
    onComplete: () => {
      state.currentIndex--;
      state.isAnimating = false;
      // updateNavigationDots();
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
      // updateBackground(prevSection.id, prevSection.bgPosition);
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
    onDown: () => handleScrollInput("up"),
    onUp: () => handleScrollInput("down"),
    tolerance: 10,
    preventDefault: true,
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
  progress.className = "scroll-progress";
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
 * Update navigation dots
 */
// function updateNavigationDots(): void {
//   const dots = document.querySelectorAll(".section-nav__dot");
//   dots.forEach((dot, index) => {
//     dot.classList.toggle("active", index === state.currentIndex);
//   });
// }

/**
 * Create navigation dots
 */
// function createNavigationDots(): void {
//   const nav = document.createElement("nav");
//   nav.className = "section-nav";
//   nav.innerHTML = `
//     <style>
//       .section-nav {
//         position: fixed;
//         right: 2rem;
//         top: 50%;
//         transform: translateY(-50%);
//         z-index: 9999;
//         display: flex;
//         flex-direction: column;
//         gap: 0.75rem;
//       }
//       .section-nav__dot {
//         width: 12px;
//         height: 12px;
//         border-radius: 50%;
//         background: rgba(255, 255, 255, 0.3);
//         border: none;
//         cursor: pointer;
//         transition: all 0.3s ease;
//         padding: 0;
//       }
//       .section-nav__dot:hover {
//         background: rgba(255, 255, 255, 0.6);
//         transform: scale(1.2);
//       }
//       .section-nav__dot.active {
//         background: rgba(99, 102, 241, 1);
//         transform: scale(1.3);
//       }
//       .section-nav__dot.tall::after {
//         content: '';
//         position: absolute;
//         width: 4px;
//         height: 4px;
//         background: rgba(255, 255, 255, 0.5);
//         border-radius: 50%;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//       }
//       @media (max-width: 768px) {
//         .section-nav {
//           right: 1rem;
//         }
//         .section-nav__dot {
//           width: 10px;
//           height: 10px;
//         }
//       }
//     </style>
//   `;

//   state.sections.forEach((section, index) => {
//     const dot = document.createElement("button");
//     dot.className =
//       "section-nav__dot" +
//       (index === 0 ? " active" : "") +
//       (section.isTall ? " tall" : "");
//     dot.setAttribute("aria-label", `Go to section ${section.id}`);
//     dot.addEventListener("click", () => goToSection(index));
//     nav.appendChild(dot);
//   });

//   document.body.appendChild(nav);
// }

/**
 * Go to specific section
 */
// async function goToSection(targetIndex: number): Promise<void> {
//   if (state.isAnimating) return;
//   if (targetIndex === state.currentIndex) return;
//   if (targetIndex < 0 || targetIndex >= state.sections.length) return;

//   const direction = targetIndex > state.currentIndex ? "down" : "up";
//   const currentSection = state.sections[state.currentIndex];
//   const targetSection = state.sections[targetIndex];

//   state.isAnimating = true;

//   // Play exit animation if going forward and section has one
//   if (direction === "down" && currentSection.hasExitAnimation) {
//     await playExitAnimationAsync(currentSection);
//     await new Promise((resolve) => setTimeout(resolve, 100));
//   }

//   const tl = gsap.timeline({
//     onComplete: () => {
//       state.currentIndex = targetIndex;
//       state.isAnimating = false;
//       updateNavigationDots();
//       updateProgressBar();
//     },
//   });

//   // Move current section out
//   tl.to(
//     currentSection.element,
//     {
//       top: direction === "down" ? "-100%" : "100%",
//       duration: TRANSITION_DURATION,
//       ease: TRANSITION_EASE,
//     },
//     0
//   );

//   // Reset all sections in between
//   state.sections.forEach((section, index) => {
//     if (index !== state.currentIndex && index !== targetIndex) {
//       gsap.set(section.element, {
//         top: index < targetIndex ? "-100%" : "100%",
//       });
//     }
//   });

//   // Set target starting position
//   gsap.set(targetSection.element, {
//     top: direction === "down" ? "100%" : "-100%",
//   });

//   // Move target section in
//   tl.to(
//     targetSection.element,
//     {
//       top: "0%",
//       duration: TRANSITION_DURATION,
//       ease: TRANSITION_EASE,
//     },
//     0
//   );

//   // Update background
//   tl.call(
//     () => {
//       // updateBackground(targetSection.id, targetSection.bgPosition);
//     },
//     [],
//     TRANSITION_DURATION * 0.3
//   );

//   // Play entry animation
//   tl.call(
//     () => {
//       gsap.set(targetSection.element.querySelectorAll(".animate-item"), {
//         opacity: 0,
//         y: 40,
//       });
//       if (targetSection.isTall) {
//         targetSection.element.scrollTop = 0;
//       }
//       // const entryTl = getEntryAnimation(targetSection.entryAnimation, targetSection.element);
//       // entryTl.play();
//     },
//     [],
//     TRANSITION_DURATION * 0.4
//   );
// }

/**
 * Main initialization function
 */
export function initScrollController(): void {
  // Initialize background manager
  // initBackgroundManager();

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

  // Create navigation dots
  // createNavigationDots();

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
