import { router, type Href } from "expo-router";

/** Navigate when typed routes are stale until Metro regenerates `.expo/types/router.d.ts` */
export function navigate(href: Href) {
  router.push(href);
}
