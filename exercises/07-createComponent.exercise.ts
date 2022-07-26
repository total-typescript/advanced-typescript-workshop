/**
 * 🧑‍💻 Here, we've got a piece of frontend code that helps
 * us assign CSS classes to variants.
 */

export const createComponent = <TComponent extends Record<string, string>>(
  component: TComponent,
) => {
  return (variant: keyof TComponent, ...otherClasses: string[]): string => {
    return component[variant] + " " + otherClasses.join(" ");
  };
};

const getButtonClasses = createComponent({
  primary: "bg-blue-300",
  secondary: "bg-green-300",
});

const classes = getButtonClasses("primary");
