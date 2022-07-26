const userAccessModel = {
  user: ["update-self", "view"],
  admin: ["create", "update-self", "update-any", "delete", "view"],
  anonymous: ["view"],
} as const;

export type Role = keyof typeof userAccessModel;
export type Action = typeof userAccessModel[Role][number];

export const canUserAccess = (role: Role, action: Action) => {
  return (userAccessModel[role] as ReadonlyArray<Action>).includes(action);
};
