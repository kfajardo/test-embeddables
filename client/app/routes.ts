import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/add-bank-account-wio", "routes/add-bank-account-wio.tsx"),
  route("/add-bank-account-operator", "routes/add-bank-account-operator.tsx"),
  route(".well-known/*", "routes/well-known.tsx"),
] satisfies RouteConfig;
