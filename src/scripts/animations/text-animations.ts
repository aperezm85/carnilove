import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

export const animateTextWaveIn = ({ title }: { title: HTMLElement | null }) => {
  const mySplitText = new SplitText(title, { type: "chars" });
  const chars = mySplitText.chars;

  gsap.from(chars, {
    yPercent: 200,
    stagger: 0.02,
    opacity: 0,
    ease: "back.out",
    duration: 0.5,
  });
};

export const animateParagraphWaveIn = ({
  paragraph,
}: {
  paragraph: HTMLElement | null;
}) => {
  const mySplitText = new SplitText(paragraph, { type: "lines" });
  const lines = mySplitText.lines;

  gsap.from(lines, {
    rotationX: -100,
    transformOrigin: "50% 50% -160px",
    opacity: 0,
    duration: 0.8,
    ease: "power3",
    stagger: 0.25,
  });
};

export const typewriteText = ({ element }: { element: HTMLElement | null }) => {
  if (!element) return;
  const mySplitText = new SplitText(element, { type: "words, chars" });
  const chars = mySplitText.chars;

  gsap.from(chars, {
    opacity: 0,
    stagger: 0.05,
    ease: "power2.out",
    duration: 1,
  });
};
