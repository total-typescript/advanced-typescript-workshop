/**
 * #1
 *
 * 💡 First, you can't pass an invalid route to the
 * first argument.
 *
 * const routes = makeRouter({
 *   "/": {},
 * });
 *
 * routes.goTo("/users");
 *             ^ ⛔️
 *
 * Second, you get autocomplete on the search parameters
 * that you specify in the array in makeRoutes.
 *
 * Third, you can't pass a second argument to routes.goTo at
 * all if you haven't specified a search param on that route.
 *
 * const routes = makeRouter({
 *   "/": {},
 * });
 *
 * routes.goTo("/", {});
 *                  ^ ⛔️
 *
 * #2
 *
 * const makeRouter2 = <TConfig>(config: TConfig) => {
 *   return {
 *     config,
 *     goTo: (route: keyof TConfig) => {},
 *   };
 * };
 *
 * #3
 *
 * 💡 This is failing because we haven't constrained TConfig
 * properly. Add TConfig extends BaseRouterConfig to get it to
 * work.
 *
 * const makeRouter2 = <TConfig extends BaseRouterConfig>(config: TConfig) => {
 *
 * #4
 *
 * 💡 Two solutions come to mind here. Either:
 *
 * type TupleToSearchParams<TTuple extends string[]> = Partial<
 *   Record<TTuple[number], string>
 * >;
 *
 * This makes use of the Partial and Record types.
 *
 * OR:
 *
 * type TupleToSearchParams<TTuple extends string[]> = {
 *   [SearchParam in TTuple[number]]?: string;
 * };
 *
 * #5
 *
 * ⛔️ This error is happening because in BaseRouterConfig, we specify
 * that search can be undefined. We're doing that via the ?: operator.
 *
 * The issue is that inside TupleToSearchParams, we've specified
 * that the TTuple MUST be string[]. You can't pass undefined into
 * that slot. We need to resolve this somehow.
 *
 * #6
 *
 * goTo: <TRoute extends keyof TConfig>(
 *   route: TRoute,
 *   search?: TConfig[TRoute]["search"] extends string[]
 *     ? TupleToSearchParams<TConfig[TRoute]["search"]>
 *     : undefined,
 * ) => {},
 *
 * #7
 *
 * getSearch: <TRoute extends keyof TConfig>(
 *   route: TRoute,
 * ): TConfig[TRoute]["search"] extends [string, ...string[]]
 *   ? TupleToSearchParams<TConfig[TRoute]["search"]> | undefined
 *   : undefined => {
 *   // Runtime: Grab the search params from the route
 *
 *   return undefined;
 * },
 *
 * #8
 *
 * There are several solutions to this, but here's mine:
 *
 * goTo: <TRoute extends keyof TConfig>(
 *   route: TRoute,
 *   search?: TConfig[TRoute]["search"] extends [string, ...string[]]
 *     ? TupleToSearchParams<TConfig[TRoute]["search"]>
 *     : undefined,
 * ) => {},
 */
