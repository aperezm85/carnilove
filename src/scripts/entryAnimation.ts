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
  InstinctsEntryAnimation,
  InstinctsExitAnimation,
} from "./animations/instincts";

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
  }
  return noAnimation(element);
}
