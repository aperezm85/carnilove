import { animateTextWaveIn } from "@/scripts/animations/text-animations";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

export function FeedTheirNatureEntryAnimation(element: Element) {
  const feedTitle = element.querySelector("#feed-their-nature-title");
  const feedSubtitle = element.querySelector("#feed-their-nature-subtitle");
  const feedDescription = element.querySelector(
    "#feed-their-nature-description"
  );
  const feedButton = element.querySelector("#feed-button");

  const videoFeedPlaceholder = element.querySelector("#video-feed-placeholder");

  const dog = element.querySelector("#dog1");

  const tl = gsap.timeline();
  animateTextWaveIn({
    title: feedTitle as HTMLElement,
  });
  animateTextWaveIn({
    title: feedSubtitle as HTMLElement,
  });
  animateTextWaveIn({
    title: feedDescription as HTMLElement,
  });

  gsap.set(videoFeedPlaceholder, { opacity: 0, yPercent: 0 });

  return tl
    .to(dog, {
      duration: 0.1,
      onComplete: () => {
        document.getElementById("dog1")!.style.display = "block";
        (document.getElementById("dog1") as HTMLImageElement).src = (
          document.getElementById("dog1") as HTMLImageElement
        ).getAttribute("data-dog1") as string;
      },
    })

    .fromTo(
      videoFeedPlaceholder,
      {
        yPercent: 100,
        opacity: 0,
        ease: "back.out",
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "back.out",
      }
    )
    .fromTo(
      feedButton,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.3"
    );
}

export function FeedTheirNatureExitAnimation(element: Element) {
  const feedButton = element.querySelector("#feed-button");

  const videoFeedPlaceholder = element.querySelector("#video-feed-placeholder");

  const dog = element.querySelector("#dog1");

  const tl = gsap.timeline();
  return tl
    .to(dog, {
      duration: 0.1,
      onComplete: () => {
        (document.getElementById("dog1") as HTMLImageElement).src = (
          document.getElementById("dog1") as HTMLImageElement
        ).getAttribute("data-dog3") as string;
      },
    })
    .to(videoFeedPlaceholder, {
      yPercent: -100,
      opacity: 0,
      ease: "back.in",
      delay: 2,
    })
    .to(feedButton, { opacity: 0, y: 20 }, "-=0.3");
}
