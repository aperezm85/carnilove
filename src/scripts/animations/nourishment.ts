import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";
import { animateTextWaveIn, typewriteText } from "./text-animations";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let animation: GSAPTimeline;

export function NourishmentEntryAnimation(element: Element) {
  animation && animation.revert();

  const title = element.querySelector("#nourishment-title");
  const description = element.querySelector("#nourishment-description");

  const filters = element.querySelector("#nou-product-filters");

  const productCards = element.querySelectorAll(".full-product-card");

  gsap.set([filters], { opacity: 0 });

  animateTextWaveIn({ title: title as HTMLElement });
  typewriteText({ element: description as HTMLElement });

  animation = gsap
    .timeline({
      delay: 0.5,
    })
    .fromTo(
      filters,
      { opacity: 0, y: -200 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    )
    .fromTo(
      productCards,
      { opacity: 0, y: -100 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      },
      "+=0"
    );
  return animation;
}

export function NourishmentExitAnimation(element: Element) {
  animation = gsap.timeline();

  const filters = element.querySelector("#nou-product-filters");
  const productCards = element.querySelectorAll(".full-product-card");

  return animation
    .to(filters, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.out",
    })
    .to(
      productCards,
      {
        opacity: 0,
        y: -100,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      },
      "-=0.3"
    );
}
