export function nonNullQuerySelector(tag: string) {
  const element = document.querySelector(tag);

  if (!element) {
    throw new Error(`Element not found with tag: ${tag}`);
  }

  return element;
}

function onLoad() {
  const result = nonNullQuerySelector("body");
  result.addEventListener("gamepadconnected", (e) => {
    console.log(e.gamepad);
  });
}
