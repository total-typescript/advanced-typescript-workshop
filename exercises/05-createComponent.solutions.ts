/**
 * #1
 *
 * 💡 Observation 1: Anything you pass into the createComponent
 * config object becomes a possible variant you can then call
 * in getButtonClasses.
 *
 * const getButtonClasses = createComponent({
 *   primary: "bg-blue-300",
 *   secondary: "bg-green-300",
 * });
 *
 * const classes = getButtonClasses("tertiary");
 *                                   ^ ⛔️
 *
 * You'll see an error when passing something that doesn't
 * exist in the config. You'll also see that you get
 * autocomplete in the first argument of getButtonClasses.
 *
 * 💡 Observation 2: You'll notice that you'll get an error if
 * you pass in non-strings into the values of the config in
 * createComponent:
 *
 * const getButtonClasses = createComponent({
 *   primary: 1,
 *   ^ ⛔️
 *   secondary: "bg-green-300",
 * });
 *
 * Type 'number' is not assignable to type 'string'.
 *
 * #2
 *
 * 💡 The Record type lets us create an object where:
 *
 * 1. The keys of the object are the first parameter
 * 2. The values of the object are the second parameter
 *
 * export const createComponent = (config: Record<string, string>) => {
 *
 * #3
 *
 * This could be solved many ways - here's mine:
 *
 * export const createComponent = (config: Record<string, string>) => {
 *   return (variant: string, ...classes: string[]) => {
 *     return config[variant] + " " + classes.join(" ");
 *   };
 * };
 *
 * #4
 *
 * 💡 The reason this isn't being inferred is because we
 * haven't USED the generic anywhere in our function
 * arguments. So it's unknown, because TypeScript doesn't
 * know what we want to store in the generic slot.
 *
 * 🛠 Change config: Record<string, string> to be TConfig.
 *
 * ⛔️ You'll see an error:
 *
 * Element implicitly has an 'any' type because expression
 * of type 'string' can't be used to index type 'unknown'.
 *
 * Don't worry, we'll get to that in a minute.
 *
 * #5
 *
 * 💡 This is happening because we've specified you can pass
 * ANY string to variant. TypeScript is complaining because
 * you can't use string to access properties of TConfig.
 *
 * There's only one way to tell TypeScript that this is safe
 * - by changing variant from string to keyof TConfig.
 *
 * 🛠 Make the change:
 *
 * return (variant: keyof TConfig, ...classes: string[]) => {
 *
 * ✅ The error disappears! Hooray!
 *
 * #6
 *
 * export const createComponent = <TConfig extends Record<string, string>>(
 *   config: TConfig,
 * ) => {
 */
