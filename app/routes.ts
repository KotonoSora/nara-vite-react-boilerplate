import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Language action route (without language prefix)
  route("action/set-language", "routes/action.set-language.ts"),
  route("action/set-theme", "routes/action.set-theme.ts"),
  
  // Routes with optional language parameter
  index("routes/($lang)._index.tsx"),
  route("($lang)/showcase", "routes/($lang).showcase.tsx", [
    index("routes/($lang).showcase._index.tsx"),
  ]),
] satisfies RouteConfig;
