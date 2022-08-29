/**
 * 🧑‍💻 We're building a scheduling app for a large HR company.
 * We built our backends and frontends separately, but there
 * was a bit of miscommunication about the enums we would use
 * to represent different bookings. The backend is now using
 * SCREAMING_SNAKE_CASE, but we're using camelCase.
 *
 * So we've made a map to convert from the backend version of
 * ProgramMode - GROUP, ANNOUNCEMENT etc - to the frontend
 * version - group, announcement etc.
 */

export const programModeEnumMap = {
  //         ^ 🚁
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const;

/**
 * 🚁 Hover over programModeEnumMap. It should display
 * as an object with LOTS of readonly properties, all inferred
 * as their literal type ("group", "announcement" etc).
 */

export type ProgramMap = typeof programModeEnumMap;
/**         ^ 🚁
 *
 * 🚁 Hover over ProgramMap - it should be exactly the same
 * display as when you hovered over programModeEnumMap
 */

export type Program = ProgramMap[keyof ProgramMap];
/**         ^ 🚁
 *
 * 🚁 Program is being inferred as a union type of all of
 * the frontend enums. Interesting.
 */

//          ⬇️ 🚁
export type IndividualProgram = ProgramMap[
  | "ONE_ON_ONE"
  | "SELF_DIRECTED"
  | "PLANNED_ONE_ON_ONE"
  | "PLANNED_SELF_DIRECTED"];

/**
 * 🚁 IndividualProgram is all of the enums, EXCEPT for
 * the ones with the keys of GROUP and ANNOUNCEMENT
 */

export type GroupProgram = ProgramMap["GROUP"];
/**         ^ 🚁
 *
 * 🚁 GroupProgram is just the "group" member of the union.
 */

/**
 * 🛠 OK, we know what each section does. Now let's recreate
 * it. Comment out all of the code EXCEPT for the
 * programModeEnumMap.
 */

/**
 * 💡 The remaining code is just JavaScript - except for a
 * little extra annotation: "as const"
 *
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
 *
 * Let's investigate what this does.
 */

/**
 * 🛠 Remove the "as const" annotation:
 *
 * export const programModeEnumMap = {
 *   GROUP: "group",
 *   ANNOUNCEMENT: "announcement",
 *   ONE_ON_ONE: "1on1",
 *   SELF_DIRECTED: "selfDirected",
 *   PLANNED_ONE_ON_ONE: "planned1on1",
 *   PLANNED_SELF_DIRECTED: "plannedSelfDirected",
 * };
 *
 * 🚁 Now, hover over programModeEnumMap. You'll
 * notice that each of the properties are now inferred
 * as string, not their literal types.
 *
 * Why is this? It's because objects in JavaScript are
 * mutable by default.
 *
 * 🕵️‍♂️ Try reassigning one of the properties of
 * programModeEnumMap:
 *
 * programModeEnumMap.GROUP = 'some-other-thing';
 *
 * You'll see that it doesn't throw an error.
 */

/**
 * 🛠 Add the as const annotation back in.
 *
 * ⛔️ You'll see that the line we wrote above is now erroring!
 *
 * Cannot assign to 'GROUP' because it is a read-only property.
 *
 * 🛠 Remove that line of code to clear the error.
 *
 * 💡 This is good! We don't want our config objects to be mutable.
 * You can also achieve this with Object.freeze, but this only
 * works one level deep on objects. 'as const' works recursively
 * down the entire object.
 */

/**
 * 💡 We now want to derive our enum type from this object
 * so that we can use it in the rest of our application.
 *
 * To do that, we're going to need to pull it from the
 * runtime world into the type world.
 *
 * We'll need to use typeof for that:
 *
 * https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
 *
 * 🛠 Declare a new type called ProgramMap, which uses typeof
 * on the programModeEnumMap:
 *
 * type ProgramMap = typeof programModeEnumMap;
 */

/**
 * 💡 All this does is pull the inferred type of programModeEnumMap
 * into the type world, so we can manipulate it using TS syntax.
 *
 * 🛠 Let's declare a new type, GroupProgram, and make it the property
 * 'GROUP' of ProgramMap:
 *
 * type GroupProgram = ProgramMap["GROUP"];
 *      ^ 🚁
 *
 * 🚁 Hover over GroupProgram - it should be inferred as "group"
 */

/**
 * 💡 "as const" and typeof are a powerful combination, because
 * they let us do really clever things with config objects.
 *
 * Without "as const", this inference would look very different.
 *
 * 🕵️‍♂️ Try removing "as const" again. When hovering over GroupProgram,
 * it will now be inferred as a string! So "as const" is crucial
 * to deriving types from config objects. Add it back in again.
 */

/**
 * 💡 Let's now recreate the IndividualProgram type, which represents
 * all the members of the enum that are for individuals only.
 *
 * We want to create a union type of all the possible individual
 * programs. To do that, you can pass in a union type to the property
 * access!
 *
 * 🛠 Create a new type called IndividualProgram. Make it a property
 * access on ProgramMap, but pass in ONE_ON_ONE, SELF_DIRECTED,
 * PLANNED_ONE_ON_ONE and PLANNED_SELF_DIRECTED as a union.
 *
 *             ⬇️ 🚁
 * export type IndividualProgram = ProgramMap[
 *   | "ONE_ON_ONE"
 *   | "SELF_DIRECTED"
 *   | "PLANNED_ONE_ON_ONE"
 *   | "PLANNED_SELF_DIRECTED"];
 *
 * 🚁 Hover over IndividualProgram - it should be a union of
 * "1on1" | "selfDirected" | "planned1on1" | "plannedSelfDirected"
 *
 * 🕵️‍♂️ Try altering some of the members of the union you're passing in,
 * noticing how IndividualProgram also gets altered.
 */

/**
 * 💡 This concept, that you can access objects via a union type to
 * RETURN a union type, is critical for understanding complex types.
 *
 * 💡 We still don't have a union type for ALL of the members of
 * the enum. To do that, we'd need to pass a union of ALL the keys
 * of ProgramMap BACK to ProgramMap.
 *
 * For that, we're going to use keyof:
 *
 * https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
 */

/**
 * 🛠 Let's create a type called BackendProgram. Assign it to
 * keyof ProgramMap:
 *
 * type BackendProgram = keyof ProgramMap;
 *      ^ 🚁
 *
 * 🚁 Hover over BackendProgram. You should see that it's a union
 * of all of the keys in programModeEnumMap.
 */

/**
 * 🛠 Create a new type called Program, which accesses ProgramMap with
 * ALL of ProgramMap's keys:
 *
 * type Program = ProgramMap[BackendProgram];
 *      ^ 🚁
 *
 * 🚁 You'll see that Program is typed as a union of all of the
 * members of the frontend enum:
 *
 * "group" | "announcement" | "1on1" | "selfDirected"
 * | "planned1on1" | "plannedSelfDirected"
 */

/**
 * 💡 You can use this pattern: Obj[keyof Obj] as a kind of
 * Object.values for the type world.
 */

/**
 * 💡 Well done! We've covered 'as const', 'keyof', and accessing
 * index types via unions.
 *
 * 🕵️‍♂️ Try experimenting with programModeEnumMap, changing the keys
 * and values to see what errors, or what changes in each of
 * the derived types.
 */
