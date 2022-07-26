/**
 * #1
 *
 * Try a go-to-definition on result.addEventListener
 *
 * result.addEventListener(
 *        ^ 🔮
 *
 * If you're in VSCode, you can try 'go to type definition'
 * on:
 *
 * const result = nonNullQuerySelector("body");
 *       ^ 🔮
 *
 * result.addEventListener("gamepadconnected", (e) => {
 *        ^ 🔮                                  ^ 🔮
 *
 * #2
 *
 * 💡 Observation 1:
 *
 * addEventListeners always appear in pairs. The first
 * one of the pair appears to have a generic signature,
 * with K extends keyof HTMLElementEventMap. The second
 * appears to not be generic, but has a type: string
 * instead.
 *
 * 💡 Observation 2:
 *
 * In the first of each pair, the listener is typed like so.
 *
 * For instance, in HTMLLabelElement:
 *
 * this: HTMLLabelElement, ev: HTMLElementEventMap[K]
 *
 * In the second of each pair, the listener is typed as
 * EventListenerOrEventListenerObject, which seems less
 * specific.
 *
 * 💡 Observation 3:
 *
 * You may also have noticed that HTML elements interfaces
 * follow a common pattern:
 *
 * HTMLAnchorElement
 * HTMLAreaElement
 * HTMLAudioElement
 * HTMLButtonElement
 *
 * It makes sense, given this pattern, that HTMLBodyElement
 * might be around somewhere.
 *
 * #3
 *
 * 💡 Yes, it does. HTMLBodyElementEventMap, which
 * HTMLBodyElement.addEventListener uses, extends
 * WindowEventHandlersEventMap, which contains:
 *
 * "gamepadconnected": GamepadEvent;
 *
 * #4
 *
 * 💡 It looks like .addEventListener is being called inside Element,
 * which uses ElementEventMap for its first generic. You can
 * see that ElementEventMap only accepts two properties -
 * fullscreenchange and fullscreenerror.
 *
 * #5
 *
 * 💡 Inside nonNullQuerySelector, we declare tag as string. Our
 * tag is never going to be anything other than string, because
 * nonNullQuerySelector itself is not generic.
 *
 * Because our tag can only be string, we can only ever hit the
 * widest third overload of document.querySelector, meaning that
 * the elements we return will always be Element, never
 * HTMLBodyElement.
 *
 * querySelector<E extends Element = Element>(selectors: string): E | null;
 *
 * 💡 In order to overcome this problem, we're going to need to
 * mirror document.querySelector's overloads with
 * nonNullQuerySelector. Otherwise, we'll always just trigger
 * that last overload and our inference won't work.
 *
 * #6
 *
 * export function nonNullQuerySelector<K extends keyof HTMLElementTagNameMap>(
 *   tag: K,
 * ): HTMLElementTagNameMap[K];
 * export function nonNullQuerySelector(tag: string) {
 */
