/**
 * Background Manager
 *
 * Handles background position, scale, and color transitions
 * based on the current active section.
 */

import gsap from "gsap";

interface BgPosition {
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
}

interface BackgroundElements {
  container: HTMLElement;

  savannah: HTMLElement;
  rocks: HTMLElement;
  forest: HTMLElement;
}

let bgElements: BackgroundElements | null = null;
let currentSection: string | null = null;

/**
 * Initialize background manager
 */
export function initBackgroundManager(): void {
  const container = document.getElementById("parallax-bg");
  if (!container) return;

  bgElements = {
    container,
    savannah: container.querySelector("#savannah") as HTMLElement,
    rocks: container.querySelector("#rocks") as HTMLElement,
    forest: container.querySelector("#forest") as HTMLElement,
  };
}

/**
 * Update background position based on section data
 */
export function updateBackground(
  sectionId: string,
  position: BgPosition[]
): void {
  if (!bgElements || currentSection === sectionId) return;

  currentSection = sectionId;

  const tl = gsap.timeline();

  // Animate the savannah layer
  tl.to(
    bgElements.savannah,
    {
      y: `${position[0]?.y ?? 0}%`,
      scale: position[0]?.scale ?? 1,
      opacity: position[0]?.opacity ?? 1,
      duration: 1.5,
      ease: "power2.out",
    },
    0
  );

  // Animate the rocks layer with parallax offset
  tl.to(
    bgElements.rocks,
    {
      y: `${position[1]?.y ?? 0}%`,
      scale: position[1]?.scale ?? 1,
      opacity: position[1]?.opacity ?? 1,
      duration: 1.5,
      ease: "power2.out",
    },
    0
  );

  // Animate the forest layer with parallax offset
  tl.to(
    bgElements.forest,
    {
      y: `${position[2]?.y ?? 0}%`,
      scale: position[2]?.scale ?? 1,
      opacity: position[2]?.opacity ?? 1,
      duration: 1.5,
      ease: "power2.out",
    },
    0
  );
}
