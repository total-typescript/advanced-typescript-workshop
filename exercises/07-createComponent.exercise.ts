/**
 * 🧑‍💻 Here, we've got a piece of frontend code that helps us
 * assign CSS classes to variants of components. It's a common
 * pattern in apps which use utility CSS libraries, like
 * Tailwind.
 */

/**
 * 💡 Our first generic function! We'll break down what this
 * means later.
 *
 * There's also a Record type here, I wonder what that means...
 */
export const createComponent = <TConfig extends Record<string, string>>(
  config: TConfig,
) => {
  /**
   * 💡 It looks like it returns another function, which takes
   * in both the variant and as many other classes as you like.
   */
  return (variant: keyof TConfig, ...otherClasses: string[]): string => {
    return config[variant] + " " + otherClasses.join(" ");
  };
};

const getButtonClasses = createComponent({
  primary: "bg-blue-300",
  secondary: "bg-green-300",
});

const classes = getButtonClasses("primary", "px-4 py-2");
/**
 * 🕵️‍♂️ Time for an investigation. Play around with the two
 * function calls above to see what you can figure out
 * about the API.
 *
 * I've written down two observations - see if you can get
 * them both.
 *
 * Solution #1
 */

/**
 * 🛠 OK, let's break this down. Comment out all of the
 * code above.
 *
 * 🛠 Create a function called createComponent. Make that
 * function take in a single argument, config, typed as
 * unknown. Export it.
 *
 * export const createComponent = (config: unknown) => {}
 *
 * 🛠 Make createComponent return another function, which
 * takes in variant: string and returns config[variant].
 *
 * export const createComponent = (config: unknown) => {
 *   return (variant: string) => {
 *     return config[variant];
 *   };
 * };
 *
 * 🛠 You should also adjust the return type so that it
 * appends any other classes you want to pass to
 * config[variant].
 *
 * Solution #3
 */

/**
 * ⛔️ Error!
 *
 * return config[variant];
 *        ^ ⛔️
 *
 * Object is of type 'unknown'.
 *
 * That's right - we haven't typed our config properly.
 *
 * 🛠 See if you can figure out how to type this correctly,
 * using the Record type from TypeScript:
 *
 * https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
 *
 * Solution #2
 */

/**
 * 🕵️‍♂️ Try using your new function.
 *
 * const getButtonClasses = createComponent({
 *   primary: "bg-blue-300",
 *   secondary: "bg-green-300",
 * });
 *
 * const classes = getButtonClasses("primary", "px-4 py-2");
 *                                   ^ 🕵️‍♂️
 */

/**
 * 🕵️‍♂️ You'll notice we're not getting the same safety as we
 * had in our previous setup. You can pass anything into
 * the first argument of getButtonClasses:
 *
 * const classes = getButtonClasses("awdawkawd", "px-4 py-2");
 *
 * This doesn't seem very helpful or typesafe.
 *
 * 💡 If you picture our function calls, it goes something
 * like this:
 *
 * createComponent(config) =>
 * getButtonClasses(variant, ...classes) =>
 * classes
 *
 * The type of variant is going to be the keys of the config
 * object passed to createComponent. This means there's an
 * "inference dependency" between variant and config. If the
 * type of config changes, the type of variant is also going
 * to need to change.
 *
 * In order to make this work, we need a mechanism for storing
 * what the config is inferred as so that we can use it later
 * in getButtonClasses to type variant.
 *
 * We're going to use generics for this method of storage.
 *
 * https://www.typescriptlang.org/docs/handbook/2/generics.html
 *
 * 💡 Our plan is this:
 *
 * 1. Store config in a generic slot called TConfig
 * 2. Make the type of variant the keys of TConfig
 * 3. Profit.
 */

/**
 * 🛠 Let's get this working. Add a generic slot to your
 * createComponent function. Don't change the actual type
 * of config: yet.
 *
 * export const createComponent = <TConfig>(config: Record<string, string>) => {
 *
 * 🚁 Hover over your createComponent call:
 *
 * const getButtonClasses = createComponent({
 *                          ^ 🚁
 *
 * Whenever you call a generic function, you can use hovers
 * to determine what its generic slots are being inferred as.
 *
 * In this case, its slots are:
 *
 * <unknown>(config: Record<string, string>)
 *
 * I.e. a single slot, typed as unknown.
 *
 * 🕵️‍♂️ This doesn't seem right. We're passing in a config object,
 * but it's being inferred as unknown. Shouldn't it be being
 * inferred as the config object we're passing in?
 *
 * Discuss among yourselves why this is happening, and how to
 * solve it.
 *
 * Solution #4
 */

/**
 * 🚁 Now that you've fixed it, try hovering createComponent({
 * again:
 *
 * const getButtonClasses = createComponent({
 *                          ^ 🚁
 *
 * You'll now see that we're storing the type of the config in
 * the slot:
 *
 * <{
 *     primary: string;
 *     secondary: string;
 * }>
 *
 * Hooray! We can then use this to type variant.
 */

/**
 * ⛔️ Back to this error:
 *
 * Element implicitly has an 'any' type because expression
 * of type 'string' can't be used to index type 'unknown'.
 *
 * 🕵️‍♂️ Try working this one out yourselves. Here's some things
 * you've seen:
 *
 * When you didn't assign anything to TConfig, it defaulted
 * to the type of 'unknown'.
 *
 * We've removed the Record<string, string> from the function
 * completely.
 *
 * Solution #5
 */

/**
 * 🚁 Now that that's fixed, we've incidentally managed to get
 * something working. Try hovering getButtonClasses:
 *
 * const getButtonClasses = createComponent({
 *   primary: "bg-blue-300",
 *   secondary: "bg-green-300",
 * });
 *
 * const classes = getButtonClasses("primary", "px-4 py-2");
 *                 ^ 🚁
 *
 * You'll see that variant is now typed as "primary" | "secondary".
 * It'll give you autocomplete, and it'll also error if you don't
 * pass one of those values.
 */

/**
 * 💡 Hooray! Looks like we're nearly done. But there's one
 * thing we haven't covered yet.
 *
 * 🕵️‍♂️ You'll notice that it's still possible to pass invalid
 * values to createComponent():
 *
 * const getButtonClasses = createComponent({
 *   primary: 12,
 *   ^ 🕵️‍♂️
 *   secondary: "bg-green-300",
 * });
 *
 * primary should be erroring here because we're passing a
 * number, not a string.
 *
 * 💡 This is tricky. We've said that whatever gets inferred
 * to config should be stored in TConfig, but we've lost the
 * ability to constrain what shape config should be.
 *
 * We can achieve this again with generic constraints:
 *
 * https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints
 *
 * 🛠 Add a constraint to TConfig that matches our desired type.
 *
 * Take a look at the docs for the syntax.
 *
 * Solution #6
 */

/**
 * ⛔️ You'll now see an error appearing on primary: 12
 *
 * Type 'number' is not assignable to type 'string'.
 *
 * That's good! That matches the behaviour we were seeing before.
 *
 * 💡 That means we've completed our task! We've got the
 * autocomplete working and we've made it impossible to pass
 * an invalid config to createComponent.
 */

/**
 * 💡 Great job! We've covered the basics of generics,
 * constraining generics and the idea of "inference
 * dependencies". When you notice a dependency between
 * two types in a function, it's usually time to start
 * thinking about using a generic (or a function overload,
 * which we'll cover later.)
 */
