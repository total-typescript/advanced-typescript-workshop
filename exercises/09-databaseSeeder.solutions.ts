/**
 * #1
 *
 * addUser = <TId>(id: TId, user: Omit<User, "id">) => {
 *
 * #2
 *
 * addUser = <TId extends string>(id: TId, user: Omit<User, "id">) => {
 *
 * #3
 *
 * addPost = <TId extends string>(id: TId, post: Omit<Post, "id">) => {
 *
 * #4
 *
 * export class DbSeeder<TDatabase> {
 *
 * #5
 *
 * addUser = <TId extends string>(
 *   id: TId,
 *   user: Omit<User, "id">,
 * ): DbSeeder<
 *   TDatabase & { users: TDatabase["users"] & Record<TId, User> }
 * > => {
 *
 * #6
 *
 * export class DbSeeder<TDatabase extends DbShape> {
 *
 * #7
 *
 * addPost = <TId extends string>(
 *   id: TId,
 *   post: Omit<Post, "id">,
 * ): DbSeeder<
 *   TDatabase & { posts: TDatabase["posts"] & Record<TId, Post> }
 * > => {
 *
 * #8
 *
 * 💡 The reason that we're getting Record<string, User> and
 * Record<string, Post> is that transact() still returns the
 * plain old DbShape, not our dynamically created TDatabase.
 *
 * 🛠 The solution is to add a cast inside transact() which
 * changes the type from this.users to TDatabase['users']:
 *
 * transact = async () => {
 *   return {
 *     users: this.users as TDatabase["users"],
 *     posts: this.posts as TDatabase["posts"],
 *   };
 * };
 *
 * 💡 We can see here that casts can be pretty useful for
 * situations where the type world knows more than the
 * runtime world.
 *
 * #9
 *
 * 🛠 Add a default generic which includes a user with the
 * id of joel. Also, add it to the runtime users attribute.
 *
 * export class DbSeeder<
 *   TDatabase extends DbShape = {
 *     users: {
 *       joel: User;
 *     };
 *     posts: {};
 *   },
 * > {
 *   public users: DbShape["users"] = {
 *     joel: {
 *       id: "joel",
 *       name: "joel",
 *     },
 *   };
 */
