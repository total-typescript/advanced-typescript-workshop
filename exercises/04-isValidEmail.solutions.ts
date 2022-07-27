/**
 * #1 below:
 */

export type Opaque<TValue, TOpaque> = TValue & {
  __: TOpaque;
};

type PostId = Opaque<string, "PostId">;
type UserId = Opaque<string, "UserId">;

const getUserById = (id: UserId) => {};
const getPostById = (id: PostId) => {};

// Method 1 - assertion function

function assertIsUserId(id: any): asserts id is UserId {}

const id = "123";
assertIsUserId(id);
getUserById(id);

// Method 2 - type predicate

function isUserId(id: any): id is UserId {
  return true;
}

const id2 = "123";
if (isUserId(id2)) {
  getUserById(id2);
}

// Method 3 - casting

getUserById("123" as UserId);
