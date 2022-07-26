export function fetchUser(
  id: string,
  opts?: {
    timeout?: number;
  },
): Promise<{
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}>;
