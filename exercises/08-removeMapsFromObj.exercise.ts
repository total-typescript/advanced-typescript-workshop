/**
 * 💡 In this example, we're getting a bunch of data
 * back from our API which is coming in with a funny
 * shape. Each key is being prefixed with maps:,
 * like below.
 */

interface ApiData {
  "maps:longitude": string;
  "maps:latitude": string;
}

/**
 * 💡 These keys are pretty horrible to work with
 * in JavaScript, so the engineers came up with a
 * great idea - what if we could remove them and
 * ONLY work with latitude: string and longitude: string.
 *
 * 💡 They came up with a dynamic function, removeMapsPrefixFromObj,
 * so that they could remove a `maps:` prefix from the
 * keys of the entire object.
 */

type RemoveMapsPrefixFromObj<TObj> = {
  [ObjKey in keyof TObj as RemoveMaps<ObjKey>]: TObj[ObjKey];
};

/**
 * 🕵️‍♂️ To understand RemoveMapsPrefixFromObj, try creating a new type,
 * called StrippedApiData, which uses RemoveMapsPrefixFromObj on
 * ApiData.
 *
 * type StrippedApiData = RemoveMapsPrefixFromObj<ApiData>
 *      ^ 🚁
 *
 * 🚁 If you change the content of ApiData, StrippedApiData
 * will change.
 *
 * 🕵️‍♂️ Note that if you add something that _doesn't_ have
 * a maps prefix, it'll still be preserved.
 */

type RemoveMaps<TString> = TString extends `maps:${infer TSuffix}`
  ? TSuffix
  : TString;

/**
 * 🕵️‍♂️ To understand RemoveMaps, try creating a new type called
 * MapsRemoved, which calls RemoveMaps on 'maps:something':
 *
 * type MapsRemoved = RemoveMaps<"maps:something">;
 *      ^ 🚁
 *
 * 🚁 If you change "maps:something" to "maps:somethingElse" or
 * "whatever", you should see different results.
 */

export const removeMapsPrefixFromObj = <TObj>(
  obj: TObj
): RemoveMapsPrefixFromObj<TObj> => {
  const newObj = {} as any;
  /**               ^ 🕵️‍♂️
   * 🕵️‍♂️ Try removing the 'as any', and see what error occurs.
   *
   * ⛔️ Several errors, but the bottom one is:
   *
   * Type '{}' is not assignable to type 'RemoveMapsPrefixFromObj<TObj>'.
   *
   * 🛠 Add the as any back in before carrying on.
   */

  for (const key in obj) {
    if (key.startsWith("maps:")) {
      newObj[key.substring(5)] = obj[key];
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

/**
 * 🕵️‍♂️ Try calling removeMapsPrefixFromObj on a random object to see
 * if it does the same thing as the type helper, RemoveMapsPrefixFromObj:
 *
 * const strippedObj = removeMapsPrefixFromObj({ "maps:longitude": 12 });
 *       ^ 🚁
 *
 * 🚁 The hint is not terribly useful here - it just shows
 * the type RemoveMapsPrefixFromObj being called:
 *
 * const strippedObj: RemoveMapsPrefixFromObj<{
 *   "maps:longitude": number;
 * }>;
 *
 * 🕵️‍♂️ Try accessing some properties on strippedObj:
 *
 * strippedObj.longitude
 *
 * You'll see that strippedObj only has the properties that don't
 * have maps: prefixed to them. So our function works!
 */

/**
 * 💡 OK - let's start reimplementing this step-by-step.
 *
 * 🛠 Comment out the RemoveMaps type completely. Let's build
 * it again from scratch.
 *
 * ⛔️ You should be seeing an error above:
 *
 * Cannot find name 'RemoveMaps'.
 *
 * 🛠 Let's create it in its simplest form:
 *
 * type RemoveMaps = any;
 *
 * ⛔️ Another error!
 *
 * Type 'RemoveMaps' is not generic.
 *
 * 🛠 Add a generic slot to it to relax this error:
 *
 * type RemoveMaps<TString> = any;
 */

/**
 * ✅ The error has gone! But don't get too excited -
 * that any is covering up all manner of sins.
 *
 * 🚁 Hover over StrippedApiData above:
 *
 * type StrippedApiData = {
 *   [x: string]: string;
 * }
 *
 * 💡 Our beautiful inference has gone.
 * RemoveMapsPrefixFromObj is now returning just an object
 * where the keys could be any string.
 *
 * RemoveMaps is responsible for figuring out the new key
 * of the object based on whether it contains a "maps:" or not.
 */

/**
 * 🛠 An improvement would be to return TString from RemoveMaps
 * instead of just any:
 *
 * 🚁 StrippedApiData now shows up as:
 *
 * type StrippedApiData = {
 *   "maps:longitude": string;
 *   "maps:latitude": string;
 * }
 *
 * So our keys are being inferred now, but the "maps:" element
 * isn't being removed.
 */

/**
 * 💡 How would we solve this in JS? We would:
 *
 * 1. Check if TString has a maps prefix.
 * 2. If it does, strip it
 * 3. If it doesn't, just return it.
 *
 * When you find yourself needing if/else logic in TypeScript,
 * it's time for a conditional type!
 *
 * https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
 */

/**
 * 🛠 Change the return of RemoveMaps to be a conditional type. They're
 * expressed in ternaries in TypeScript, and the check is performed via
 * an 'extends' keyword. For now, make both branches return TString:
 *
 * type RemoveMaps = TString extends any ? TString : TString;
 * //                ⬆️ Conditional         ⬆️ True    ⬆️ False
 */

/**
 * 💡 The if statement here looks pretty weird to new TS devs.
 * Think of it like this: we're checking if TString fits into the
 * 'any' slot. A simpler example might show this off:
 */

type ConditionalResult = string extends number ? true : false;
//   ^ 🚁

/**
 * 🚁 You can see here that because string is not assignable
 * to number, ConditionalResult is always false.
 *
 * 🕵️‍♂️ Try changing string extends number to string extends string.
 * It should become true.
 *
 * 🕵️‍♂️ Try changing string extends string to "brian" extends string:
 * it should stay true. That's because "brian" could be passed
 * to a function that expects any string.
 */

/**
 * 💡 The check that we're writing is a bit trickier than this.
 * We need to check if TString is a string which has "maps:" at
 * the start. To do that, we'll need to use a string literal type:
 *
 * https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
 *
 * 🛠 Change RemoveMaps' conditional check so that it checks if
 * TString extends `maps:${string}`
 *
 * Solution #1
 *
 * 🛠 Let's check this is working by changing the true result
 * to 'hooray':
 *
 * type RemoveMaps<TString> = TString extends `maps:${string}` ? 'hooray' : TString;
 */

/**
 * 🚁 Hover over MapsRemoved. It should be inferred as "hooray".
 * That's because the string we've passed in ("maps:something")
 * is assignable to `maps:${string}`.
 *
 * 🕵️‍♂️ Try passing in something without a "maps:" prefix. It won't
 * return "hooray", it'll just return what gets passed in. That's
 * because it's failing the condition, so it's returning TString.
 */

/**
 * 💡 We're nearly there. But there's still a major problem to solve.
 * We're successfully DETECTING that there's a maps prefix, but we're
 * not EXTRACTING the rest of the string.
 *
 * It would be great if, when we did the check, there was a way declaring
 * some new inferred variables from that check.
 *
 * 💡 Enter the infer keyword.
 *
 * https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types
 *
 * Infer lets us, in the context of a conditional check, infer some info
 * from that check.
 */

type GetData<TObj> = TObj extends { data: infer TData } ? TData : never;
/**                                       ⬆️ Infers a new generic slot
 *                                          at this position
 */

type Data = GetData<{ data: number }>;
//   ^ 🚁

/**
 * 🕵️‍♂️ Try changing the data: number above, and seeing the inferred value
 * of Data change.
 */

/**
 * 🛠 We're going to use infer to help us infer the rest of TString.
 * Replace ${string} with ${infer TRest}, then return it from the
 * true portion of the check.
 *
 * Solution #2
 */

/**
 * 🚁 Hover over RemoveMaps - it's working! It'll now strip out maps:
 * correctly.
 *
 * 🚁 Hover over StrippedApiData - it's also working! It's stripping out
 * all the keys correctly.
 */

/**
 * 🛠 On to type RemoveMapsPrefixFromObj. Let's comment it out first,
 * and recreate it as a simple object with a single generic slot in
 * the type.
 *
 * type RemoveMapsPrefixFromObj<TObj> = {}
 */

/**
 * 🛠 We know we need to create a new object based on the keys
 * of the previous object. For that, we'll use the Key in keyof
 * pattern that we've seen before. We want to preserve the object's
 * values.
 *
 * https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
 *
 * Solution #3
 */

/**
 * 🚁 Hover over StrippedApiData. You should see that the keys
 * are not being altered - we're just recreating the object
 * that gets passed in.
 */

/**
 * 🛠 Let's get our RemoveMaps helper involved. We want to be
 * able to remove maps from the object keys, so let's apply it to
 * keyof TObj.
 *
 * type RemoveMapsPrefixFromObj<TObj> = {
 *   [Key in RemoveMaps<keyof TObj>]: TObj[Key];
 * };
 */

/**
 * ⛔️ There's an error!
 *
 * Type 'Key' cannot be used to index type 'TObj'.
 *
 * Hmmm, this makes sense when you think about it.
 * Key in RemoveMaps<keyof TObj> is going to remove maps: from
 * the object keys. But we can't use those object keys to access
 * keys ON THE ORIGINAL OBJECT.
 *
 * So, we need a way to re-map the keys while still retaining
 * the original key as a variable.
 */

/**
 * 💡 Luckily, TypeScript has a way to handle it! It's called
 * key remapping.
 *
 * https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as
 */

/**
 * 🛠 Remove RemoveMaps<> from keyof TObj. Instead, use the as
 * syntax inside the index.
 *
 * Make sure to call RemoveMaps<Key>, not RemoveMaps<keyof TObj>.
 *
 * type RemoveMapsPrefixFromObj<TObj> = {
 *   [Key in keyof TObj as RemoveMaps<Key>]: TObj[Key];
 * };
 */

/**
 * 🚁 Hooray! StrippedApiData should be being remapped successfully.
 * Most of the work had been done already in RemoveMaps -
 * RemoveMapsPrefixFromObj just remaps the keys.
 */

/**
 * 💡 Finally, let's take a look at removeMapsPrefixFromObj. We're
 * not going to re-implement this one because it's relatively simple.
 * But let me point out some details:
 *
 * 💡 It takes a <TObj> generic, meaning that anything passed to
 * it can be manipulated and used in the output.
 *
 * 💡 The return type is our RemoveMapsPrefixFromObj type,
 * which is being called on TObj.
 *
 * 🕵️‍♂️ There's an 'as any' sticking out like a sore thumb. Try
 * removing it again. Discuss in your group whether the 'as any' is
 * necessary in this position.
 */

/**
 * 💡 Great job! We've covered conditional types, infer and
 * key remapping all in one example.
 */

/**
 * 🕵️‍♂️ Stretch goal 1: Create a type helper which can remove ":post"
 * suffixes from a string.
 *
 * type Target = "attribute:post";
 *
 * type PostRemoved = RemovePostSuffix<Target>;
 *      ^ 🚁
 *
 * PostRemoved should be "attribute".
 *
 * Solution #4
 *
 * 🕵️‍♂️ Stretch goal 2:
 *
 * Create an object remapper which adds '_new' as a suffix to all
 * object keys.
 *
 * interface Obj {
 *   a: number;
 *   b: number;
 * }
 *
 * type NewObj = AddNewKeys<Obj>;
 *      ^ 🚁
 *
 * NewObj should be { a_new: number; b_new: number }
 *
 * Solution #5
 */
