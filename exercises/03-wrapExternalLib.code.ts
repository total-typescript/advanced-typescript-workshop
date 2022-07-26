import { fetchUser } from "external-lib";

export const fetchUserWithFullName = async (
  ...args: Parameters<typeof fetchUser>
): Promise<Awaited<ReturnType<typeof fetchUser>> & { fullName: string }> => {
  const user = await fetchUser(...args);
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  };
};
