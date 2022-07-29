export const createComponent = <TConfig extends Record<string, string>>(
  config: TConfig,
) => {
  return (variant: keyof TConfig, ...otherClasses: string[]): string => {
    return config[variant] + " " + otherClasses.join(" ");
  };
};

const getButtonClasses = createComponent({
  primary: "bg-blue-300",
  secondary: "bg-green-300",
});

const classes = getButtonClasses("primary", "px-4 py-2");
