import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";
import { animateTextWaveIn } from "./text-animations";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let animation: GSAPTimeline;

export function FAQEntryAnimation(element: Element) {
  animation && animation.revert();

  const title = element.querySelector("#faq_title");
  const faqQuestions = element.querySelector("#faq_questions");

  const dog = element.querySelector("#footer-dog") as HTMLImageElement;
  const cat = element.querySelector("#footer-cat") as HTMLImageElement;

  animation = gsap.timeline();
  animateTextWaveIn({ title: title as HTMLElement });

  animation
    .from(faqQuestions, {
      xPercent: -100,
      opacity: 0,
      ease: "power2.out",
    })
    .to(dog, {
      duration: 0.1,
      delay: 1,
      onComplete: () => {
        dog.style.display = "block";
        cat.style.display = "block";
        dog.src = dog.getAttribute("data-src") as string;
        cat.src = cat.getAttribute("data-src") as string;
      },
    });

  return animation;
}

export function FAQExitAnimation(element: Element) {
  const dog = element.querySelector("#footer-dog") as HTMLImageElement;
  const cat = element.querySelector("#footer-cat") as HTMLImageElement;

  animation = gsap.timeline();
  animation.to(dog, {
    duration: 0.1,
    delay: 0.5,
    onComplete: () => {
      dog.style.display = "none";
      cat.style.display = "none";
    },
  });

  return animation;
}
