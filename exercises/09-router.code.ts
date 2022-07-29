import { F } from "ts-toolbelt";

type BaseRouterConfig = Record<string, { search?: string[] }>;

const makeRouter = <TConfig extends BaseRouterConfig>(
  config: F.Narrow<TConfig>,
) => {
  return {
    config,
    goTo: <TRoute extends keyof TConfig>(
      route: TRoute,
      search?: TConfig[TRoute]["search"] extends string[]
        ? { [SearchParam in TConfig[TRoute]["search"][number]]?: string }
        : never,
    ) => {
      let newRoute = String(route);

      if (search) {
        newRoute += new URLSearchParams(
          search as Record<string, string>,
        ).toString();
      }
      window.location.href = newRoute;
    },
  };
};

const routes = makeRouter({
  "/": {},
  "/dashboard": {
    search: ["page", "perPage", "something"],
  },
});

routes.goTo("/");
routes.goTo("/dashboard", {
  page: "1",
  something: "",
});
