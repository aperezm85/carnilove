import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SplitText } from "gsap/SplitText";
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let splittedTextLabel: SplitText,
  splittedTextTitle: SplitText,
  splittedTextSubtitle: SplitText,
  animation: GSAPTimeline;

export function ShopEntryProductAnimation(element: Element) {
  splittedTextLabel && splittedTextLabel.revert();
  splittedTextTitle && splittedTextTitle.revert();
  splittedTextSubtitle && splittedTextSubtitle.revert();

  const productCards = element.querySelectorAll(".product-card");
  const productTitle = element.querySelector("#product-title");
  const productSubtitle = element.querySelector("#product-subtitle");
  const productLabel = element.querySelector("#product-label");
  const productFilters = element.querySelector("#product-filters");

  splittedTextLabel = SplitText.create(productLabel, {
    type: "line,words",
  });
  splittedTextTitle = SplitText.create(productTitle, {
    type: "line,words",
  });
  splittedTextSubtitle = SplitText.create(productSubtitle, {
    type: "chars,words,lines",
  });

  const productLabelChars = splittedTextLabel.words;
  const productTitleChars = splittedTextTitle.words;
  const productSubtitleChars = splittedTextSubtitle.lines;

  gsap.set(
    [
      productLabelChars,
      productTitleChars,
      productCards,
      productFilters,
      productSubtitleChars,
    ],
    { opacity: 0 }
  );

  animation = gsap
    .timeline()
    .fromTo(
      [productLabelChars, productTitleChars],
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
      }
    )
    .fromTo(
      productSubtitleChars,
      {
        rotationX: -100,
        transformOrigin: "50% 50% -160px",
        duration: 0.8,
        ease: "power3",
        stagger: 0.25,
      },
      {
        rotationX: 0,
        duration: 0.8,
        stagger: 0.25,
        opacity: 1,
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
    )
    .fromTo(
      productFilters,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    );

  return animation;
}

export function ShopExitProductAnimation(element: Element) {
  splittedTextLabel && splittedTextLabel.revert();
  splittedTextTitle && splittedTextTitle.revert();
  splittedTextSubtitle && splittedTextSubtitle.revert();

  const productCards = element.querySelectorAll(".product-card");
  const productTitle = element.querySelector("#product-title");
  const productSubtitle = element.querySelector("#product-subtitle");
  const productLabel = element.querySelector("#product-label");
  const productFilters = element.querySelector("#product-filters");

  splittedTextLabel = new SplitText(productLabel, {
    type: "line,words",
  });
  splittedTextTitle = new SplitText(productTitle, {
    type: "line,words",
  });
  splittedTextSubtitle = new SplitText(productSubtitle, {
    type: "chars,words,lines",
  });

  const productLabelChars = splittedTextLabel.words;
  const productTitleChars = splittedTextTitle.words;
  const productSubtitleChars = splittedTextSubtitle.lines;

  animation = gsap
    .timeline()
    .to(productFilters, {
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
    )
    .to(
      [productLabelChars, productTitleChars],
      {
        yPercent: -100,
        opacity: 0,
        stagger: 0.1,
      },
      "-=0.5"
    )
    .to(
      productSubtitleChars,
      {
        rotationX: -100,
        transformOrigin: "50% 50% 160px",
        duration: 0.8,
        ease: "power3",
        stagger: 0.25,
        opacity: 0,
      },
      "-=0.5"
    );
  return animation;
}
