import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";
import { animateTextWaveIn } from "./text-animations";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let splittedTextLabel: SplitText, animation: GSAPTimeline;

export function IngredientsEntryAnimation(element: Element) {
  animation && animation.revert();

  splittedTextLabel && splittedTextLabel.revert();

  const bowl = document.getElementById("bowl");

  const title = element.querySelector("#ingredients-title");
  const description = element.querySelector("#ingredients-description");
  const button = element.querySelector("#ingredients-button");
  const label = element.querySelector("#ingredients-label");

  splittedTextLabel = SplitText.create(label, {
    type: "line,words",
  });

  const labelChars = splittedTextLabel.words;

  animateTextWaveIn({
    title: title as HTMLElement,
  });
  animateTextWaveIn({
    title: description as HTMLElement,
  });

  gsap.set([labelChars], {
    opacity: 0,
  });

  animation = gsap
    .timeline()
    .fromTo(
      [labelChars],
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
      }
    )
    .from("#benefit-meat", {
      top: 0,
      left: "35%",
      opacity: 0,
    })
    .from("#benefit-plant", { top: 0, left: "55%", opacity: 0 })
    .from("#benefit-grain", { top: 0, left: "75%", opacity: 0 })
    .from(
      bowl,
      { yPercent: 200, xPercent: -300, rotate: 360, opacity: 0, scale: 0.5 },
      "<0.2"
    )
    .to(
      {},
      {
        duration: 0.5,
        onStart: () => {
          document.getElementById("puppy")!.style.display = "block";
          (document.getElementById("puppy") as HTMLImageElement).src = (
            document.getElementById("puppy") as HTMLImageElement
          ).getAttribute("data-dog1") as string;
        },
      }
    );

  return animation;
}

export function IngredientsExitAnimation(element: Element) {
  splittedTextLabel && splittedTextLabel.revert();

  const bowl = document.getElementById("bowl");

  const title = element.querySelector("#ingredients-title");
  const description = element.querySelector("#ingredients-description");
  const label = element.querySelector("#ingredients-label");

  splittedTextLabel = new SplitText(label, {
    type: "line,words",
  });

  const labelChars = splittedTextLabel.words;

  animation = gsap
    .timeline()

    .to(
      [labelChars],
      {
        yPercent: -100,
        opacity: 0,
        stagger: 0.1,
      },
      "-=0.5"
    )
    .to(
      {},
      {
        duration: 2,
        onStart: () => {
          (document.getElementById("puppy") as HTMLImageElement).src = (
            document.getElementById("puppy") as HTMLImageElement
          ).getAttribute("data-dog3") as string;
        },
        onComplete: () => {
          document.getElementById("puppy")!.style.display = "none";
        },
      }
    )
    .to(bowl, { yPercent: 200, xPercent: -100, rotate: -360, opacity: 0 })
    .to("#benefit-meat", { top: 0, xPercent: 35, opacity: 0 }, "<0.2")
    .to("#benefit-plant", { top: 0, xPercent: 55, opacity: 0 }, "<0.2")
    .to("#benefit-grain", { top: 0, xPercent: 75, opacity: 0 }, "<0.2");

  return animation;
}
