import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import {
  FeedTheirNatureEntryAnimation,
  FeedTheirNatureExitAnimation,
} from "./animations/feed-their-nature";
import {
  ShopEntryProductAnimation,
  ShopExitProductAnimation,
} from "./animations/shop-products";

import {
  IngredientsEntryAnimation,
  IngredientsExitAnimation,
} from "./animations/ingredients";
import {
  InstinctsEntryAnimation,
  InstinctsExitAnimation,
} from "./animations/instincts";

import {
  FindYourPathEntryAnimation,
  FindYourPathExitAnimation,
} from "./animations/find-your-path";

import { FAQEntryAnimation, FAQExitAnimation } from "./animations/faq";
import {
  FromTheWildEntryAnimation,
  FromTheWildExitAnimation,
} from "./animations/from-the-wild";
import {
  NourishmentEntryAnimation,
  NourishmentExitAnimation,
} from "./animations/nourishment";
import {
  TrustedEntryAnimation,
  TrustedExitAnimation,
} from "./animations/trusted";

gsap.registerPlugin(ScrollTrigger, SplitText);

function noAnimation(_element: Element): gsap.core.Timeline {
  return gsap.timeline();
}

export function getEntryAnimation(element: Element) {
  switch (element.id) {
    case "shop-by-product":
      return ShopEntryProductAnimation(element);
    case "feed-their-nature":
      return FeedTheirNatureEntryAnimation(element);
    case "instincts":
      return InstinctsEntryAnimation(element);
    case "ingredients":
      return IngredientsEntryAnimation(element);
    case "find-your-path":
      return FindYourPathEntryAnimation(element);
    case "trusted":
      return TrustedEntryAnimation(element);
    case "nourishment":
      return NourishmentEntryAnimation(element);
    case "from-the-wild":
      return FromTheWildEntryAnimation(element);
    case "FAQ":
      return FAQEntryAnimation(element);
  }
  return noAnimation(element);
}

export function getExitAnimation(element: Element) {
  switch (element.id) {
    case "shop-by-product":
      return ShopExitProductAnimation(element);
    case "feed-their-nature":
      return FeedTheirNatureExitAnimation(element);
    case "instincts":
      return InstinctsExitAnimation(element);
    case "ingredients":
      return IngredientsExitAnimation(element);
    case "find-your-path":
      return FindYourPathExitAnimation(element);
    case "trusted":
      return TrustedExitAnimation(element);
    case "nourishment":
      return NourishmentExitAnimation(element);
    case "from-the-wild":
      return FromTheWildExitAnimation(element);
    case "FAQ":
      return FAQExitAnimation(element);
  }
  return noAnimation(element);
}
