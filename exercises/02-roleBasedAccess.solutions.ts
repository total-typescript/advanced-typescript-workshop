/**
 * Solution #1
 *
 * 💡 The reason that this works:
 *
 * type Action = UserAccessModelValues[number];
 *
 * Is because number, in this position, represents a union
 * type of ALL possible numbers. So TypeScript uses this
 * as a shortcut to say "this is how you"
 */

/**
 * Solution #2
 *
 * 💡 Often, when doing more advanced typings, you're going to find
 * that casting to any is the most productive solution in your arsenal.
 * Many libraries doing advanced TS work, like TRPC and Zod, use 'any'
 * liberally.
 *
 * Because TypeScript is fundamentally not a sound type system (because
 * JavaScript itself is unsound), you will occasionally need to use any's
 * in _some places_ in your apps. My opinion is that the best place for
 * them is hidden away in useful functions, like the one above. Any's for
 * the function creator, not the function consumer.
 *
 * For the curious - yes, I found a different solution -
 * ReadonlyArray<Action> - which I'll explain in the break.
 */
