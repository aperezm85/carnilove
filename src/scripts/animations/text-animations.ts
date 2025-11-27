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
