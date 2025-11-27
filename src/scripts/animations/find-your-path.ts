import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";
import { animateParagraphWaveIn, typewriteText } from "./text-animations";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let animation: GSAPTimeline;

export function FindYourPathEntryAnimation(element: Element) {
  animation && animation.revert();
  const title = element.querySelector("#find-your-path-header");
  const description = element.querySelector("#find-your-path-subheader");
  const paragraphBg = element.querySelector("#paragraph-bg");

  typewriteText({ element: title as HTMLElement });
  animateParagraphWaveIn({ paragraph: description as HTMLElement });

  animation = gsap
    .timeline()
    .from(paragraphBg, {
      xPercent: -150,
      ease: "power2.out",
    })
    .from(".card", {
      yPercent: -200,
      opacity: 0,
      stagger: 0.4,
      // duration: 1,
      ease: "power2.out",
    })
    .from(
      ".arrow",
      {
        yPercent: -200,
        opacity: 0,
        stagger: 0.4,
        // duration: 1,
        ease: "power2.out",
      },
      "-=0.2"
    );

  return animation;
}

export function FindYourPathExitAnimation(element: Element) {
  const title = element.querySelector("#find-your-path-header");
  const description = element.querySelector("#find-your-path-subheader");
  const paragraphBg = element.querySelector("#paragraph-bg");

  animation = gsap
    .timeline()
    .to(paragraphBg, {
      xPercent: -150,
      ease: "power2.out",
    })
    .to(".card", {
      yPercent: -200,
      opacity: 0,
      stagger: 0.4,
      ease: "power2.out",
      reversed: true,
    })
    .to(
      ".arrow",
      {
        yPercent: -200,
        opacity: 0,
        stagger: 0.4,
        ease: "power2.out",
        reversed: true,
      },
      "-=2"
    );
  return animation;
}
