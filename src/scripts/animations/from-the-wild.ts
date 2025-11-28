import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";
import { animateTextWaveIn, typewriteText } from "./text-animations";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let animation: GSAPTimeline;

export function FromTheWildEntryAnimation(element: Element) {
  animation && animation.revert();

  const title = element.querySelector("#from-the-wild-title");
  const description = element.querySelector("#from-the-wild-description");

  animateTextWaveIn({ title: title as HTMLElement });
  typewriteText({ element: description as HTMLElement });

  return animation;
}

export function FromTheWildExitAnimation(element: Element) {
  animation = gsap.timeline();
  return animation;
}
