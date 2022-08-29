/**
 * 🧑‍💻 Here, we've got a fetchUser function coming from an
 * external library. We wanted to concatenate the user's
 * first name and last name into a fullName property,
 * so we added a fetchUserWithFullName function.
 *
 * The types are a little complex, it would be great if
 * we could simplify them.
 */
import { fetchUser } from "external-lib";
/**      ^ 🚁
 *
 * 🚁 Hover fetchUser. We can see that it's giving us some
 * good typing information. It's returning a promise
 * containing an object with some user-like properties.
 */

export const fetchUserWithFullName = async (
  ...args: Parameters<typeof fetchUser>
): Promise<Awaited<ReturnType<typeof fetchUser>> & { fullName: string }> => {
  /**
   * 💡 Ouch, that's a lot of generics in a row.
   */
  const user = await fetchUser(...args);
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    /**
     * 🕵️‍♂️ Try commenting out the line above, and see what errors
     * occur.
     */
  };
};

/**
 * 🚁 Hover ...args.
 *
 * ...args: Parameters<typeof fetchUser>
 *    ^ 🚁
 *
 * You'll see it's typed as a tuple representing the two
 * parameters of fetchUser.
 */

/**
 * 💡 This is our first intro to generic code - and a lot of it
 * can look like this: Something<SomethingElse<Wow<Deeper<Ok>>>>.
 *
 * 🧑‍💻 There's a reason we went for this approach. There's something
 * annoying about the type definitions for external-lib.
 *
 * 🔮 Do a go-to-definition on fetchUser:
 *
 * import { fetchUser } from "external-lib";
 *          ^ 🔮
 *
 * You'll see that the only type definition here is a single
 * function. There aren't any type defs for the return types
 * or parameters of the functions. I.e:
 *
 * interface FetchUserReturnType {
 *   id: string;
 *   firstName: string;
 *   lastName: string;
 *   age: number;
 * }
 *
 * This is an issue, because we need that information if we're going
 * to extend it with `& { fullName: string }` for our wrapper
 * function.
 */

/**
 * 💡 This is probably why the devs chose the ReturnType annotation.
 * That can be used to extract the return type from a function. Let's
 * try it out:
 *
 * 🛠 Create a new type: FetchUserReturnType:
 *
 * type FetchUserReturnType = ReturnType<typeof fetchUser>;
 *      ^ 🚁
 *
 * 🚁 Looks good, but our return type is still wrapped in a Promise.
 */

/**
 * 🛠 We can extract the value of the promise with Awaited:
 *
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#the-awaited-type-and-promise-improvements
 *
 * type FetchUserReturnType = Awaited<ReturnType<typeof fetchUser>>;
 *      ^ 🚁
 *
 * 🚁 Great, we've got our plain user type. But we still need to add fullName
 * to it.
 */

/**
 * 🛠 We can extend it by using an intersection type:
 *
 *      ⬇️ 🚁
 * type FetchUserReturnType = Awaited<ReturnType<typeof fetchUser>> & {
 *   fullName: string;
 * };
 *
 * 🚁 Looks good, we're getting the type we want.
 *
 * 🛠 I'm in the mood for a refactor. Let's take our FetchUserReturnType
 * and put it as the return type of fetchUserWithFullName.
 *
 * ): FetchUserReturnType => {
 *
 * ⛔️ Oh dear! Error:
 *
 * The return type of an async function or method must be the global
 * Promise<T> type. Did you mean to write 'Promise<FetchUserReturnType>'?
 *
 * Why, yes we did, TypeScript.
 *
 * 🛠 Wrap the return type of fetchUserWithFullName in a Promise<>
 *
 * ): Promise<FetchUserReturnType> => {
 *
 * ✅ OK, that looks good.
 *
 * 💡 It looked like all the generics in that big stack mattered. We've
 * moved it out into a new type, but it's still not particularly pretty.
 */

/**
 * 🧑‍💻 There's one more thing to think about, too. We're currently only
 * using one function from 'external-lib', fetchUser. But that's because
 * we're at the start of the project.
 *
 * We'll likely end up using 10-12 functions from that lib, so this code
 * might be duplicated many times if we want to add extra parameters to
 * the output.
 *
 * 💡 It might be time to create a helper type so we can DRY up this code.
 * Ideally, this helper would:
 *
 * Take in the function
 * Take in the things we want to add to the output
 * Return a new function with that in the output
 */

/**
 * 🛠 Add a new type called WrapFunction:
 *
 * type WrapFunction = any;
 *
 * 🛠 Create a new type called Example, and call WrapFunction with typeof
 * fetchUser.
 *
 * type Example = WrapFunction<typeof fetchUser>;
 */

/**
 * ⛔️ Error time!
 *
 * Type 'WrapFunction' is not generic.
 *
 * Makes sense, we haven't given WrapFunction any generic slots.
 *
 * 🛠 Add a generic slot to WrapFunction:
 *
 * type WrapFunction<TFunc> = any;
 *
 * ✅ All good! This now lets us manipulate TFunc and transform it.
 */

/**
 * 💡 But how do we want to transform it? We want to keep the same
 * parameters, but be able to add additional properties to what gets
 * resolved from the promise.
 *
 * 🛠 Let's start by returning a function from WrapFunction:
 *
 * type WrapFunction<TFunc> = () => any;
 *
 * 🚁 Hover Example to see the type change.
 *
 * 🛠 Let's now use Parameters, just like in fetchUserWithFullName
 * above, to extract the parameters of fetchUser.
 *
 * type WrapFunction<TFunc> = (args: Parameters<TFunc>) => any;
 *
 * ⛔️ Eek, there's an error!
 *
 * Type 'TFunc' does not satisfy the constraint '(...args: any) => any'.
 *
 * Let's investigate why this is happening.
 */

/**
 * 🔮 Do a go-to-definition on Parameters:
 *
 * type WrapFunction<TFunc> = (args: Parameters<TFunc>) => any;
 *                                   ^ 🔮
 * You'll see that Parameters<T> is a generic type. It takes one
 * generic slot: T. But it's got some funny syntax afterwards -
 * an 'extends'.
 *
 * 💡 This syntax adds a constraint to the generic slot. It says
 * that in order for this generic to be used, what gets passed in
 * MUST meet this contract.
 *
 * https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints
 *
 * The reason that our WrapFunction was erroring was that TFunc
 * doesn't meet the constraints specified by Parameters<T>.
 *
 * 🛠 We can make our function work by copying the constraint
 * from parameters into WrapFunction:
 *
 * type WrapFunction<TFunc extends (...args: any) => any> = (
 *   args: Parameters<TFunc>,
 * ) => any;
 *
 * ✅ Hooray! This now means that WrapFunction MUST be passed a
 * function in order to work.
 */

/**
 * 🛠 Let's now do the ReturnType stuff too. We need to mimic
 * the same pattern as on FetchUserReturnType:
 *
 * Awaited<
 *   ReturnType<
 *     TFunc
 *   >
 * >
 *
 * So it should become:
 *
 * ) => Awaited<ReturnType<TFunc>>;
 *
 * 🛠 Also, knowing that all the functions in the library are
 * async, we should wrap that in a Promise, too:
 *
 * ) => Promise<Awaited<ReturnType<TFunc>>>;
 */

/**
 * 💡 Let's try this out! We're going to replace the type
 * annotations on fetchUserWithFullName with a much simpler
 * one.
 *
 * 🛠 First, delete the annotation on the args and the return type:
 *
 * export const fetchUserWithFullName = async (...args) => {
 *
 * 🛠 Next, annotate the variable itself with the type of
 * WrapFunction<typeof fetchUser>
 *
 * export const fetchUserWithFullName: WrapFunction<typeof fetchUser> = async (
 *
 * ⛔️ Oops, an error!
 *
 * Argument of type '[id: string, opts?: { timeout?: number | undefined; }
 * | undefined]' is not assignable to parameter of type 'string'.
 *
 * Hmmm, we've messed something up here. It looks like we're
 * trying to squeeze the entire tuple of parameters into a slot
 * that only needs string.
 *
 * 🛠 Aha, the args in our WrapFunction helper weren't defined properly.
 * They needed to be ...args, not args:
 *
 * type WrapFunction<TFunc extends (...args: any) => any> = (
 *   ...args: Parameters<TFunc>,
 * )
 *
 * That's because the Parameters themselves needed to be spread in to
 * the new function type we created.
 *
 * ✅ Hooray! No more errors.
 */

/**
 * 💡 Except, hmmm... In this new WrapFunction helper, we aren't adding
 * the fullName property to the return type of fetchUserWithFullName.
 *
 * 🚁 Hover fetchUserWithFullName:
 *
 * export const fetchUserWithFullName: WrapFunction<typeof fetchUser> = async (
 *              ^ 🚁
 *
 * We can see that in the return type, the Promise doesn't contain a
 * 'fullName' attribute.
 *
 * This means we need to fix WrapFunction to allow passing additional
 * properties.
 *
 * 🛠 We're going to do that by allowing users to pass a second generic to
 * WrapFunction. Add a second slot: TAdditional.
 *
 * type WrapFunction<TFunc extends (...args: any) => any, TAdditional> = (
 *
 * ⛔️ Generic type 'WrapFunction' requires 2 type argument(s).
 *
 * 💡 TAdditional feels like it should be optional. Sometimes, you might not
 * want to add _any_ additional properties to the return.
 *
 * In those cases, you'd only want to use WrapFunction<typeof fetchUser>
 *
 * Luckily, TypeScript allows us to specify defaults for our generics.
 *
 * 🛠 Add a default - {} - for TAdditional
 *
 * type WrapFunction<TFunc extends (...args: any) => any, TAdditional = {}> = (
 *
 * ✅ Hooray! No more errors. Just like default parameters in functions,
 * this means you don't need to pass TAdditional.
 */

/**
 * 🛠 Let's now use TAdditional in our return type inside WrapFunction.
 * This is going to require some generics surgery to slot it in the right
 * spot.
 *
 * The right bit for it is inside the Promise that gets returned:
 *
 * ) => Promise<Awaited<ReturnType<TFunc>> & TAdditional>;
 *
 * 🕵️‍♂️ Peer closesly at this code with your group to see if you can decode
 * what's going on.
 *
 * Promise<
 *   Awaited<
 *     ReturnType<
 *       TFunc
 *     >
 *   > & TAdditional
 * >
 *
 * 💡 TAdditional is being added on to the awaited return type of TFunc.
 * Phew - generic syntax can be confusing sometimes.
 */

/**
 * 🛠 Let's put this to the test by passing something in the TAdditional
 * slot in the fetchUserWithFullName annotation:
 *
 *              ⬇️ 🚁
 * export const fetchUserWithFullName: WrapFunction<
 *   typeof fetchUser,
 *   { fullName: string }
 * > = async (...args) => {
 *
 * 🚁 Hm - the way it's printing out is pretty confusing, but no errors
 * are occurring.
 *
 * 🕵️‍♂️ Try adding different properties to TAdditional, like
 * agePlus10: number, to see if it breaks anything.
 *
 * export const fetchUserWithFullName: WrapFunction<
 *   typeof fetchUser,
 *   { fullName: string; agePlus10: number }
 * > = async (...args) => {
 */

/**
 * ⛔️ WOAH, our first properly enormous error.
 *
 * With these MASSIVE errors, my advice is to scroll to the bottom.
 * TypeScript writes its errors top-down, meaning that the actual
 * assignability error is usually at the bottom:
 *
 * Property 'agePlus10' is missing in type '{ fullName: string;
 * id: string; firstName: string; lastName: string; age: number; }'
 * but required in type '{ fullName: string; agePlus10: number; }'.
 *
 * OK, this makes sense.
 *
 * 🛠 Try adding agePlus10 to the returned object.
 *
 * agePlus10: user.age + 10,
 *
 * ✅ Hooray! It worked!
 */

/**
 * 💡 We've covered a lot - Parameters, ReturnType, as well as an
 * introduction to generics, default parameters and constraints.
 * We've seen how the type helpers pattern can help tidy up code.
 *
 * We've also seen how some clever inference can get you out of
 * tight spots when library typings aren't terribly helpful.
 */

/**
 * 🕵️‍♂️ Stretch goal 1: Create a fetchPostWithMeta function which:
 *
 * Calls fetchPost and adds
 *
 * { meta: { title: title, description: body } }
 *
 * to the output.
 *
 * Use the existing WrapFunction to give it a type definition.
 *
 * Solution #1
 */

const fetchPost = (id: string) => {
  return Promise.resolve({
    id,
    title: "Title",
    body: "Great post",
  });
};

/**
 * 🕵️‍♂️ Stretch goal 2: Given the function below, get a union
 * type of all of its parameters.
 *
 * Solution #2
 */

const funcWithManyParameters = (
  a: string,
  b: string,
  c: number,
  d: boolean,
) => {
  return [a, b, c, d].join(" ");
};

type FuncParamsAsUnion = any;
/**  ^ 🚁
 *
 * 🚁 This should be string | number | boolean
 */
