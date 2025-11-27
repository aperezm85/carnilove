import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";
import { animateTextWaveIn } from "./text-animations";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let splittedTextLabel: SplitText,
  splittedTextTitle: SplitText,
  splittedTextSubtitle: SplitText,
  animation: GSAPTimeline;

export function InstinctsEntryAnimation(element: Element) {
  splittedTextLabel && splittedTextLabel.revert();
  splittedTextTitle && splittedTextTitle.revert();
  splittedTextSubtitle && splittedTextSubtitle.revert();

  animation && animation.revert();

  const title = element.querySelector("#instincts-title");
  const description = element.querySelector("#instincts-description");
  const label = element.querySelector("#instincts-label");

  const benefit1 = document.getElementById("benefit1");

  const foodPackages = document.getElementById("food-packages");

  const instinctsVideo = document.getElementById("instincts-video");

  splittedTextLabel = SplitText.create(label, {
    type: "line,words",
  });
  splittedTextTitle = SplitText.create(title, {
    type: "line,words",
  });
  // splittedTextSubtitle = SplitText.create(description, {
  //   type: "chars,words,lines",
  // });

  const labelChars = splittedTextLabel.words;
  const titleChars = splittedTextTitle.words;
  // const subtitleChars = splittedTextSubtitle.lines;
  gsap.set([labelChars, titleChars], {
    opacity: 0,
  });

  // animateTextWaveIn({
  //   title: title as HTMLElement,
  // });

  animateTextWaveIn({
    title: description as HTMLElement,
  });

  animation = gsap
    .timeline()
    .fromTo(
      [labelChars, titleChars],
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
      }
    )

    .from(benefit1, {
      opacity: 0,
      yPercent: 0,
      xPercent: 100,
      duration: 0.5,
    })
    .from(foodPackages, {
      xPercent: -100,
      yPercent: 100,
      opacity: 0,
      ease: "back.out",
    })
    .to(
      {},
      {
        duration: 0.1,
        onStart: () => {
          (instinctsVideo as HTMLVideoElement).currentTime = 0;
          (instinctsVideo as HTMLVideoElement).play();
        },
      }
    )
    .to(
      {},
      {
        duration: 4.3,
      }
    )
    .to(
      {},
      {
        duration: 0.1,
        onStart: () => {
          (instinctsVideo as HTMLVideoElement).pause();
        },
      }
    );

  return animation;
}

export function InstinctsExitAnimation(element: Element) {
  splittedTextLabel && splittedTextLabel.revert();
  splittedTextTitle && splittedTextTitle.revert();
  splittedTextSubtitle && splittedTextSubtitle.revert();

  const title = element.querySelector("#instincts-title");
  const description = element.querySelector("#instincts-description");
  const label = element.querySelector("#instincts-label");
  const foodPackages = document.getElementById("food-packages");

  const instinctsVideo = document.getElementById("instincts-video");

  splittedTextLabel = SplitText.create(label, {
    type: "line,words",
  });
  splittedTextTitle = SplitText.create(title, {
    type: "line,words",
  });
  splittedTextSubtitle = SplitText.create(description, {
    type: "chars,words,lines",
  });

  const labelChars = splittedTextLabel.words;
  const titleChars = splittedTextTitle.words;
  const subtitleChars = splittedTextSubtitle.lines;

  animation = gsap
    .timeline()
    .to("#instincts-carousel", {
      opacity: 0,
      yPercent: -100,
      duration: 0.5,
    })
    .to(
      foodPackages,
      {
        opacity: 0,
        yPercent: 100,
        xPercent: -100,
        duration: 0.5,
      },
      "<"
    )
    .to(
      [labelChars, titleChars],
      {
        yPercent: -100,
        opacity: 0,
        stagger: 0.1,
      },
      "-=0.5"
    )
    .to(
      subtitleChars,
      {
        rotationX: -100,
        transformOrigin: "50% 50% 160px",
        duration: 0.8,
        ease: "power3",
        stagger: 0.25,
        opacity: 0,
      },
      "-=0.5"
    )
    .to(
      {},
      {
        duration: 0.1,
        onStart: () => {
          (instinctsVideo as HTMLVideoElement).play();
        },
      }
    )
    .to(
      {},
      {
        duration: 1.7,
      }
    )
    .to(
      {},
      {
        duration: 0.1,
        onStart: () => {
          (instinctsVideo as HTMLVideoElement).pause();
        },
      }
    );
  return animation;
}

function carousel() {
  const benefit1 = document.getElementById("benefit1");
  const benefit2 = document.getElementById("benefit2");
  const benefit3 = document.getElementById("benefit3");
  const leftButton = document.getElementById("left-button-instincts");
  const rightButton = document.getElementById("right-button-instincts");

  const tlButtons = gsap.timeline({
    defaults: {
      ease: "none",
      duration: 1,
    },
  });

  const tl = gsap.timeline({});

  tl.from(benefit1, {
    opacity: 0,
    yPercent: 0,
    xPercent: 100,
    duration: 0.5,
  });

  let currentSlide = 0;
  const numSlides = 3;
  leftButton?.addEventListener("click", () => {
    changeSlideInstincts((currentSlide - 1 + numSlides) % numSlides);
  });

  rightButton?.addEventListener("click", () => {
    changeSlideInstincts((currentSlide + 1) % numSlides);
  });

  function changeSlideInstincts(nextSlide: number) {
    if (nextSlide === 0) {
      tlButtons
        .fromTo(
          benefit1,
          {
            opacity: 0,
            yPercent: 100,
            xPercent: 0,
          },
          {
            opacity: 1,
            yPercent: 0,
            xPercent: 0,
          }
        )
        .to(
          benefit2,
          {
            opacity: 0,
            yPercent: 0,
            xPercent: -100,
          },
          "<"
        )
        .to(
          benefit3,
          {
            opacity: 0,
            yPercent: 0,
            xPercent: 100,
          },
          "<"
        );
    } else if (nextSlide === 1) {
      tlButtons
        .to(benefit1, {
          opacity: 0,
          yPercent: 0,
          xPercent: 100,
        })
        .fromTo(
          benefit2,
          {
            opacity: 0,
            yPercent: 100,
            xPercent: 0,
          },
          {
            opacity: 1,
            yPercent: 0,
            xPercent: 0,
          },
          "<"
        )
        .to(
          benefit3,
          {
            opacity: 0,
            yPercent: 0,
            xPercent: -100,
          },
          "<"
        );
    } else if (nextSlide === 2) {
      tlButtons
        .to(benefit2, {
          opacity: 0,
          yPercent: 0,
          xPercent: 100,
        })
        .fromTo(
          benefit3,
          {
            opacity: 0,
            yPercent: 100,
            xPercent: 0,
          },
          {
            opacity: 1,
            yPercent: 0,
            xPercent: 0,
          },
          "<"
        )
        .to(
          benefit1,
          {
            opacity: 0,
            yPercent: 0,
            xPercent: -100,
          },
          "<"
        );
    }
    currentSlide = nextSlide;
  }
}

carousel();
