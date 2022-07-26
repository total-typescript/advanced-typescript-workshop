/**
 * 🧑‍💻 Below, we've got a function called nonNullQuerySelector,
 * which wraps document.querySelector. In this app, we do a lot
 * of document.querySelector, so having a wrapper which meant
 * we didn't have to always check if element was defined was
 * useful.
 *
 * 🧑‍💻 But this line of code is erroring, and I'd love to know why.
 */

/**
 * 💡 This function looks pretty simple. We take in a tag, like
 * 'html', '.class', or something else, and pass it to
 * document.querySelector.
 */
export function nonNullQuerySelector(tag: string) {
  const element = document.querySelector(tag);
  /**                      ^ 🚁
   *
   * 🚁 We can see here that document.querySelector can return
   * either Element or null.
   */

  if (!element) {
    throw new Error(`Element not found with tag: ${tag}`);
  }

  return element;
  /**    ^ 🚁
   *
   * 🚁 By erroring if element is null, the element will be typed
   * as just Element. This means that users of this function
   * don't need to check if it's null.
   */
}

function onLoad() {
  const result = nonNullQuerySelector("body");
  result.addEventListener("gamepadconnected", (e) => {
    console.log(e.gamepad);
    /**         ^ 🚁
     *
     * 🧑‍💻 Here, we're adding a listener to the body for when
     * a gamepad is connected, but the gamepad isn't being
     * inferred as GamepadEvent.
     *
     * 🚁 Hover over e. It's being inferred as Event, not
     * GamepadEvent.
     */
  });
}

/**
 * 💡 This is a good example of relatively simple types getting
 * into trouble when attempting to interface with an external
 * library. In this case, the external library is the built-in
 * DOM types that ship with TypeScript.
 *
 * In order to use types from an external lib, it's important to
 * get to know them. Time to dive in.
 */

/**
 * 🔮 When you're not using many type annotations, it can be tricky
 * to know how to do a go-to-definition.
 *
 * Try exploring the code, trying different go-to-definition's, until
 * you end up in a file called lib.dom.d.ts.
 *
 * Solution #1
 */

/**
 * 💡 Wow, this is a big file. It's 18,323 lines long. Let's see if
 * we can find what we're looking for.
 *
 * 🔮 Try and find references to "gamepadconnected" in the file. A
 * simple 'find' will do.
 *
 * You should see five.
 *
 * 1: The first is a comment on the GamepadEvent. This is cool, might
 * be useful later.
 *
 * 2: The second is a key on a WindowEventMap, which is an interface
 * which extends GlobalEventHandlersEventMap and
 * WindowEventHandlersEventMap.
 *
 * 3: The third is a key on WindowEventHandlersMap itself.
 *
 * 4/5: Both 4/5 are part of ongamepadconnected, which doesn't seem
 * relevant.
 */

/**
 * 🔮 Go back to GamepadEvent. You should see two things:
 *
 * The first is a declare var GamepadEvent. This puts GamepadEvent
 * into the global scope, so that you can create your own GamepadEvents
 * at runtime:
 */

const gpEvent = new GamepadEvent("gamepadconnected", {
  gamepad: {} as Gamepad,
});

gpEvent.gamepad;
/**     ^ 🚁/🔮
 *
 * 🚁 As you can see here, .gamepad is a property on the GamepadEvent.
 *
 * 🔮 Do a go-to-definition on .gamepad.
 *
 * BAM, you're back in GamepadEvent again.
 */

/**
 * 💡 So, for some reason body.addEventListener('gamepadconnected')
 * isn't inferring e as GamepadEvent. If it did, our error would be
 * solved.
 *
 * 🧑‍💻 We've tried running this code on the client, and everything
 * works. I.e. e.gamepad is there when we console.log it, but not
 * in the types.
 */

/**
 * 💡 Let's check that body.addEventListener('gamepadconnected')
 * will even work.
 *
 * 🔮 Inside lib.dom.d.ts, try to search for references to
 * .addEventListener.
 *
 * Holy crap, 444 results.
 *
 * Try scrolling through a few of them to see if you can spot
 * any patterns. Discuss with your group the patterns that you're
 * seeing. In the solution, I've written down three observations.
 * See if you can get them all.
 *
 * Solution #2
 *
 */

/**
 * 💡 The fact that the functions come in pairs is interesting -
 * we'll get back to that in a minute.
 *
 * First, let's hone in on the fact that the element types
 * appear to be named in a pattern. It makes sense, given
 * what we're seeing, that HTMLBodyElement would be something
 * we should pay attention to.
 *
 * 🔮 Try searching for HTMLBodyElement.
 *
 * 13 results. You should notice that they're split out into
 * four spots:
 *
 * In HTMLBodyElementEventMap
 *
 * In the HTMLBodyElement interface
 *
 * In the declare var HTMLBodyElement
 *
 * In a HTMLElementTagNameMap
 *
 * 💡 Crucially, we appear to have found an answer to our
 * question: does the body element accept an event of
 * "gamepadconnected"?
 *
 * 🕵️‍♂️ Time for some proper sleuthing. You now have all the
 * clues to work this out. Does the body element accept an
 * event of "gamepadconnected"?
 *
 * Solution #3
 */

/**
 * 💡 OK, knowing that gives us some solid information. We're
 * a little closer to solving the mystery.
 *
 * But we still don't know why the addEventListeners were
 * arranged in pairs. Time to learn about function overloads:
 *
 * https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
 */

document.addEventListener("animationstart", (e) => {});
/**      ^ 🚁/🔮
 *
 * 🚁 Hovering over addEventListener, we can see that at the
 * end of the tooltip there's a (+1 overload).
 *
 * This tells us that there is MORE THAN ONE type signature
 * for this function.
 *
 * 🔮 By doing a go-to-definition on the .addEventListener,
 * we can see which version of the type signature is being
 * used.
 *
 * You can see that the code above is using the _first_
 * of the two.
 *
 * 🛠 Try changing animationstart above to a random string:
 *
 * document.addEventListener("awdawdhkawdjhbaw", (e) => {});
 *
 * 🔮 You'll now see that when you go-to-definition, we end
 * up at the second of the two overloads.
 */

/**
 * 💡 The reason this switch is happening is because "animationstart"
 * is a member of the DocumentEventMap.
 *
 * addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
 *                                  ^ 🔮                    ^ 🕵️‍♂️
 *
 * Because it's assignable to this function, this is the overload
 * that gets used.
 *
 * When we use something that isn't a member of the DocumentEventMap,
 * it tries the other overload - which is just "string":
 *
 * addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
 *
 * 💡 There's an important idea here. Overloads are read TOP TO BOTTOM.
 * That means you should always put your narrowest overloads above your
 * wider ones.
 *
 * 🕵️‍♂️ Go into lib.dom.d.ts and swap over the two addEventListeners, so
 * the second is at the top.
 *
 * 🚁 Hover document.addEventListener.
 *
 * document.addEventListener("animationstart", (e) => {});
 *          ^ 🚁                                ^ 🚁
 *
 * You should see that the type is now being inferred as string, and
 * the event is no longer AnimationEvent, but just Event.
 *
 * 🛠 Change it back before anyone notices!
 */

/**
 * 💡 OK, understanding overloads is the final piece of the puzzle.
 * Let's now walk backwards through the code to see if we can figure
 * out why e.gamepad is not being inferred.
 *
 * 🚁 Hover over result.addEventListener.
 *
 * result.addEventListener("gamepadconnected", (e) => {
 *        ^ 🚁/🔮
 *
 * 🔮 Do a go-to-definition to figure out which overload it's using.
 * It should be the 'string' one. Why is that? See if you can figure
 * it out.
 *
 * Solution #4
 */

/**
 * 💡 We know that HTMLBodyElement accepts a gamepadconnected event,
 * and Element appears not to.
 *
 * So now the question is - why is result inferred as Element, and
 * not HTMLBodyElement?
 */

/**
 * 🔮 Take a look at document.querySelector above:
 *
 * const element = document.querySelector(tag);
 *                          ^ 🔮
 *
 * And take a look at the example code below:
 */

const bodyElem = document.querySelector("body");
//    ^ 🚁                 ^ 🔮

/**
 * 🕵️‍♂️ Using all your sleuthing and crystal-ball skills, answer this
 * question: why does document.querySelector infer HTMLBodyElement
 * here, but NOT in our nonNullQuerySelector function?
 *
 * Solution #5
 */

/**
 * 🛠 Add an overload to nonNullQuerySelector which matches
 * document.querySelector.
 *
 * You'll need to use HTMLElementTagNameMap, and you'll need a
 * generic.
 *
 * Docs: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
 *
 * Solution #6
 *
 * ✅ Incredibly, the error disappeared.
 */

/**
 * 🚁 Hover result:
 *
 * const result = nonNullQuerySelector("body");
 *       ^ 🚁
 *
 * The result is HTMLBodyElement! Which means that:
 *
 * console.log(e.gamepad);
 *             ^ 🚁
 *
 * e is GamepadEvent! Which, as we know, has the gamepad
 * property on it.
 */

/**
 * 💡 Sometimes, type errors are not as they appear. This one
 * took us through function overloads, a deep dive into
 * lib.dom.d.ts, and generics. It turned out that the fix
 * was in a whole other section than the highlighted error.
 */

/**
 * 🕵️‍♂️ Stretch goal 1: Add another overload which uses
 * SVGElementTagNameMap to handle SVG elements, and test
 * that it works using:
 *
 * const clipPathElement = nonNullQuerySelector('clipPath');
 *       ^ 🚁 Should be SVGClipPathElement
 */
