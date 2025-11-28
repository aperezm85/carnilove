import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";
import { animateTextWaveIn } from "./text-animations";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let animation: GSAPTimeline;

export function TrustedEntryAnimation(element: Element) {
  animation && animation.revert();

  const title = element.querySelector("#trusted-title");
  const description = element.querySelector("#trusted-description");

  const trustedButton = document.getElementById("trusted-button");
  const bentoContainer = document.getElementById("bento-container");

  animateTextWaveIn({ title: title as HTMLElement });
  animateTextWaveIn({ title: description as HTMLElement });

  animation = gsap.timeline();
  animation
    .fromTo(
      trustedButton,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    )
    .fromTo(
      bentoContainer,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.3"
    );

  return animation;
}

export function TrustedExitAnimation(element: Element) {
  animation = gsap.timeline();

  const trustedButton = document.getElementById("trusted-button");
  const bentoContainer = document.getElementById("bento-container");

  animation.to(trustedButton, { opacity: 0, y: -20 }).to(
    bentoContainer,
    { yPercent: 100, opacity: 0 },

    "-=0.3"
  );

  return animation;
}
