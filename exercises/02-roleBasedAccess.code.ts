const userAccessModel = {
  user: ["update-self", "view"],
  admin: ["create", "update-self", "update-any", "delete", "view"],
  anonymous: ["view"],
} as const;

export type Role = keyof typeof userAccessModel;
export type Action<R extends Role> = typeof userAccessModel[R][number];

export const canUserAccess = <R extends Role>(role: R, action: Action<R>) => {
  return (userAccessModel[role] as ReadonlyArray<Action<R>>).includes(action);
};
