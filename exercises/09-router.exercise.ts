/**
 * 🧑‍💻 We decided to make a type-safe router for our application.
 * It made sense for us because we've got a lot of search params
 * around - for specifying the page you're on, search result
 * filters etc.
 */

/**
 * 💡 Right off the bat, there's an interesting import here.
 *
 * https://github.com/millsp/ts-toolbelt
 *
 * ts-toolbelt is a utility library for TypeScript. F is a
 * typescript namespace containing various utilities, including
 * F.Exact and F.Narrow.
 */
import { F } from "ts-toolbelt";

type BaseRouterConfig = Record<string, { search?: string[] }>;

/**
 * 💡 makeRouter is a generic function, where the generic
 * is constrained to BaseRouterConfig. It's also using
 * F.Narrow on the argument it passes in. Interesting.
 *
 * 🕵️‍♂️ Try removing the constraint on TConfig to see what
 * errors occur.
 *
 * const makeRouter = <TConfig>(
 *
 * ⛔️ As expected...
 *
 * Type '"search"' cannot be used to index type
 * 'TConfig[TRoute]'.
 *
 * OK, put that back before we carry on.
 */
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
  //  ^ 🚁
  "/": {},
  "/dashboard": {
    search: ["page", "perPage", "something"],
  },
});
/**
 * 🚁 Hover routes. That is one complex generic signature.
 * It looks like the entire config passed to makeRouter is
 * being put into the generic slot.
 */

routes.goTo("/");
routes.goTo("/dashboard", {
  page: "1",
  something: "",
});
/**
 * 🕵️‍♂️ Investigate routes.goTo above. Discuss amongst yourselves to
 * see if you can spot all of the ways that routes.goTo is type-safe.
 *
 * Solution #1
 */

/**
 * 💡 We're getting some serious type safety from our router
 * here. Let's see if we can implement it ourselves.
 *
 * 🛠 Create a new function, makeRouter2. Give it a generic slot
 * of TConfig (no constraint yet) and a parameter of config: TConfig.
 *
 * Make it return config and a function, goTo. goTo should take
 * a single argument, route, which is typed as keyof TConfig.
 *
 * Solution #2
 */

/**
 * 🛠 Try out your new function by declaring a new variable,
 * routes2, which is the return of makeRouter2.
 *
 * const routes2 = makeRouter2({
 *   "/": {},
 *   "/users": {},
 * });
 *
 * routes2.goTo("/users");
 *              ^ 🚁
 *
 * You should be getting autocomplete on goTo. Not a bad
 * start!
 */

/**
 * 🛠 Now we should implement the search parameter stuff
 * we had before.
 *
 * Let's give goTo a generic called TRoute, which extends
 * keyof TConfig. Make goTo's first argument TRoute.
 *
 * goTo: <TRoute extends keyof TConfig>(route: TRoute) => {},
 *
 * 🛠 We can now use TRoute to extract the search results
 * from our config. Let's get a basic version working.
 *
 * goTo: <TRoute extends keyof TConfig>(
 *   route: TRoute,
 *   search?: TConfig[TRoute]["search"],
 * ) => {},
 *
 * Note - search will be typed as an array of our search
 * parameters, not an object containing our search parameters.
 * We'll fix this later.
 *
 * ⛔️ Type '"search"' cannot be used to index type
 * 'TConfig[TRoute]'.
 *
 * See if you can get this working yourself:
 *
 * Solution #3
 *
 * ✅ The error should be gone!
 */

/**
 * 🕵️‍♂️ Test out the API by adding 'search' to one of your
 * routes, and calling it with .goTo:
 *
 * const routes2 = makeRouter2({
 *   "/": {},
 *   "/users": {
 *     search: ["page", "perPage"],
 *   },
 * });
 *
 * routes2.goTo("/users", ["page"]);
 *                          ^ 🚁
 *
 * 🚁 There's something wrong here. We're not getting
 * autocomplete on page or perPage. We can pass any invalid
 * value into this slot.
 *
 * 🚁 Hover over makeRouter2({
 *
 * const routes2 = makeRouter2({
 *                 ^ 🚁
 *
 * You'll notice that the generic slot inside makeRouter2
 * isn't being inferred very well. Inside "/users", we're
 * not getting ["page", "perPage"] being inferred, but
 * string[]:
 *
 * const makeRouter2: <{
 *   "/": {};
 *   "/users": {
 *     search: string[];
 *   };
 * }>
 *
 * This means that TConfig[TRoute]["search"] is going
 * to be inferred as string[], not our specific array.
 */

/**
 * 💡 The situation here is - we're not getting deep enough
 * inference on an argument being passed to a function. We
 * could require users to declare 'as const' on the config
 * they pass to makeRouter, but this has two drawbacks:
 *
 * 1. The user has to remember to specify as const.
 * 2. You'd need to change some of the types to readonly.
 *
 * Instead, we can use F.Narrow to solve all our problems.
 *
 * 🛠 Inside makeRouter2, wrap config: TConfig with F.Narrow<>
 *
 * const makeRouter2 = <TConfig extends BaseRouterConfig>(
 *   config: F.Narrow<TConfig>,
 * ) => {
 *
 * 🚁 Hover over makeRouter2:
 *
 * const routes2 = makeRouter2({
 *                 ^ 🚁
 *
 * WOW! Suddenly the inference has improved - we're getting
 * ["page", "perPage"].
 *
 * 🕵️‍♂️ Try messing with routes2.goTo(). You'll see that you
 * need to pass in the search params in the exact order
 * they're specified.
 *
 * routes2.goTo("/users", ["page", "perPage"]);
 */

/**
 * 💡 OK! We're getting somewhere. Now what we need is to
 * turn that search param extraction into an object
 * containing the properties in the tuple.
 *
 * 🛠 Create a new type helper - TupleToSearchParams, which
 * takes in TTuple and returns an object where all the members
 * of TTuple are optional properties. All the values
 * of the returned object should be optional.
 *
 * type Source = ["page", "perPage"];
 *
 * type Result = TupleToSearchParams<Source>;
 *      ^ 🚁
 *
 * 🚁 Result should be this type:
 *
 * {
 *   page?: string;
 *   perPage?: string;
 * }
 *
 * Accessing a Tuple's elements via TTuple[number] should be
 * useful here.
 *
 * Solution #4
 */

/**
 * 🛠 Use your TTupleToSearchParams helper to transform goTo's
 * second argument.
 *
 * goTo: <TRoute extends keyof TConfig>(
 *   route: TRoute,
 *   search?: TupleToSearchParams<TConfig[TRoute]["search"]>,
 * ) => {},
 *
 * ⛔️ Oh dear, there's an error!
 *
 * Type 'TConfig[string]["search"]' is not assignable to type 'string[]'.
 *   Type 'string[] | undefined' is not assignable to type 'string[]'.
 *     Type 'undefined' is not assignable to type 'string[]'.
 *
 * See if you can figure out why the error is happening.
 *
 * Solution #5
 */

/**
 * 💡 To make that error go away, we need to add a conditional
 * check BEFORE we turn the tuple into a search params object.
 *
 * We could do this in two places - inside TupleToSearchParams,
 * or BEFORE TupleToSearchParams is called. Let's do the latter.
 *
 * 🛠 In the second argument of goTo (inside makeRouter2), we're
 * going to add a conditional type. We're first going to check
 * if TConfig[TRoute]["search"] is string[]. If it is, we'll
 * call TupleToSearchParams on it.
 *
 * If it's not string[], we'll return undefined.
 *
 * Solution #6
 *
 * ✅ The error should have disappeared!
 */

/**
 * 🕵️‍♂️ Try messing about with routes.goTo():
 *
 * routes2.goTo("/users", {
 *   page: '1',
 *   perPage: '2',
 * });
 *
 * The inference should be fully working. You should be
 * able to specify search params in makeRouter2 and get
 * the autocomplete for them in routes2.goTo(). If you
 * pass search: undefined in makeRouter2, you should
 * not be able to pass anything to the search argument.
 */

/**
 * 💡 Incredible stuff! We've seen the value in F.Narrow
 * in getting deep inference in complex objects. We've
 * also gone deeper into conditional types, and figured
 * out how to manipulate function arguments based on
 * a config object.
 */

/**
 * 🕵️‍♂️ Stretch goal 1: Add a new function to the router,
 * getSearch, which returns the current search parameters
 * of the URL in a typesafe way.
 *
 * It should take in the URL, and return the search parameters
 * if the URL matches.
 *
 * Solution #7
 *
 * 🕵️‍♂️ Stretch goal 2: If the user passes an empty array
 * for search, we shouldn't call TupleToSearchParams on
 * it - and thus they shouldn't be able to pass an object
 * to the second argument of goTo.
 *
 * Solution #8
 */
