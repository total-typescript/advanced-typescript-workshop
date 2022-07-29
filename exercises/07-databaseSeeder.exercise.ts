/**
 * 🧑‍💻 Here, we've got a piece of code which helps us seed
 * our database before tests, and use that seeded data
 * in a type-safe way.
 */

/**
 * 🧑‍💻 We've got a couple of simple interfaces, User and Post,
 * which represent things in our database.
 */
interface User {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  authorId: string;
}

/**
 * 🧑‍💻 This DbShape appears to represent a pair of maps in the
 * database. Both users and posts are represented by an object
 * that has strings for keys and Users/Posts for values.
 *
 * 💡 Take a moment to look at the docs for Record:
 *
 * https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
 */
interface DbShape {
  users: Record<string, User>;
  posts: Record<string, Post>;
}

/**
 * 💡 This shape is then used to constrain the generic passed
 * to the DbSeeder class... Interesting.
 */
export class DbSeeder<TDatabase extends DbShape> {
  /**
   * 💡 Inside the class, the users references DbShape['users'].
   * So it's not referencing the generic above, but
   */
  public users: DbShape["users"] = {};
  public posts: DbShape["posts"] = {};

  /**
   * 💡 And there are a couple of functions, addUser and addPost,
   * which take in a generic Id and return an altered DbSeeder class...
   */
  addUser = <Id extends string>(
    id: Id,
    user: Omit<User, "id">,
  ): DbSeeder<TDatabase & { users: TDatabase["users"] & Record<Id, User> }> => {
    this.users[id] = {
      ...user,
      id: id,
    };
    return this;
  };

  addPost = <Id extends string>(
    id: Id,
    post: Omit<Post, "id">,
  ): DbSeeder<TDatabase & { posts: TDatabase["posts"] & Record<Id, Post> }> => {
    this.posts[id] = {
      ...post,
      id,
    };
    return this;
  };

  /**
   * 💡 Finally, there's a transact function, stubbed out here,
   * which actually saves the entities to the database and returns
   * the users and posts.
   *
   * It also uses a cast to ensure that this.users is cast to
   * TDatabase['users'], and vice versa for posts.
   */

  /**
   * Saves all users to the database in a single
   * transaction
   */
  transact = async () => {
    // PSEUDOCODE: actually add users/posts to database

    return {
      users: this.users as TDatabase["users"],
      posts: this.posts as TDatabase["posts"],
    };
  };
}

/**
 * 💡 Good, there's a usage example.
 */
const usage = async () => {
  const result = await new DbSeeder()
    .addUser("matt", {
      name: "Matt",
    })
    .addPost("post1", {
      authorId: "matt",
      title: "Post 2",
    })
    .addPost("post2", {
      authorId: "matt",
      title: "Post",
    })
    .transact();

  result.posts.post2;
  /** ^ 🚁
   *
   * 🚁 The result here is typed with _exactly_ the ids
   * that were passed in above. That means you can access
   * users.matt, users.post1 and users.post2.
   *
   * 🕵️‍♂️ Try adding extra addUser calls to the chain, and
   * extra addPost calls to the chain. See what new things
   * you can access on result.
   *
   * 🕵️‍♂️ Try removing the transact() call at the end of the
   * chain. See what errors occur.
   */
};

/**
 * 💡 This example represents one of THE most powerful patterns
 * in TypeScript - the builder pattern.
 *
 * The builder pattern uses a chain of function calls to slowly
 * build up a larger data structure. In our case, this is:
 *
 * new DbSeeder().addUser().addPost().addPost().transact();
 *     ^ 🚁        ^ 🚁       ^ 🚁      ^ 🚁      ^ 🚁
 *
 * 🚁 Hovering over each element here gives you a lot of
 * information, but you should see a pattern.
 *
 * Hovering DbSeeder returns:
 *
 * DbSeeder<{
 *   users: {};
 *   posts: {};
 * }>
 *
 * The first addUser returns the initial database plus:
 *
 * {
 *   users: Record<"matt", User>;
 * }
 *
 * Then each .addPost() adds more information to the db.
 *
 * 🚁 You'll also notice that each function call has a
 * generic slot locked in that matches the id of the entity
 * we're passing in.
 *
 * Hovering the first addUser, you'll see:
 *
 * <"matt">(id: "matt", user: Omit<User, "id">)
 *
 * This indicates that the id is locked in as "matt" in
 * that function call.
 */

/**
 * 🛠 We're going to build this up again from scratch. To
 * get started, comment out DbSeeder AND usage. Add the
 * commented-out code above INSTEAD and uncomment it.
 */

// export class DbSeeder {
//   public users: DbShape["users"] = {};
//   public posts: DbShape["posts"] = {};

//   addUser = (id: string, user: Omit<User, "id">) => {
//     this.users[id] = {
//       ...user,
//       id: id,
//     };
//     return this;
//   };

//   addPost = (id: string, post: Omit<Post, "id">) => {
//     this.posts[id] = {
//       ...post,
//       id,
//     };
//     return this;
//   };

//   transact = async () => {
//     return {
//       users: this.users,
//       posts: this.posts,
//     };
//   };
// }

// const usage = async () => {
//   const result = await new DbSeeder()
//     .addUser("matt", {
//       name: "Matt",
//     })
//     .addPost("post1", {
//       authorId: "matt",
//       title: "Post 2",
//     })
//     .addPost("post2", {
//       authorId: "matt",
//       title: "Post",
//     })
//     .transact();

//   result.posts.post2;
//   /**          ^ 🚁
//    *
//    * 🚁 With this simplified version, we're losing
//    * some of the cool inference we had before. This
//    * .post2 is now typed as Post | undefined, and we
//    * don't get autocomplete for the options we've added.
//    */
// };

/**
 * 💡 So, where do we start? Let's try and get the addUser
 * function generic working first.
 *
 * 🛠 Add a generic slot to addUser called TId. Make the
 * parameter id the TId.
 *
 * Solution #1
 *
 * ⛔️ Immediately, an error!
 *
 * Type 'TId' cannot be used to index type 'Record<string, User>'.
 *
 * That's because our record has an index type of string (the
 * first generic we pass to Record), and our TId can be anything.
 *
 * 🛠 Add a constraint to TId to ensure that TId can only be a string.
 *
 * Solution #2
 *
 * ✅ Error gone!
 *
 * 🚁 Hover over .addUser above.
 *
 * .addUser("matt", {
 *  ^ 🚁
 *
 * You'll see that "matt" is now being locked into the generic slot.
 *
 * 🛠 Do the same pattern with addPost.
 *
 * Solution #3
 *
 * 🚁 Hovering over .addPost, you should see the generic slots also
 * being locked in with the ids you pass.
 */

/**
 * 🚁 Hover over result again. You'll see that even though we've
 * added a generic to our .addUser and .addPost, it hasn't changed
 * anything about the return type. We're still getting back the
 * same thing - a record of users and a record of posts.
 *
 * 💡 That's because our addUsers and addPosts functions are supposed
 * to return a _changed_ version of DbSeeder. Currently, we're just
 * returning this. Even though we've added the new user to the users
 * and posts map, we're not telling TypeScript we've done that.
 *
 * We need to make it so that each time we call addPost and addUser,
 * we can save some information in the type level. For that, we're
 * going to need to make DbSeeder generic.
 */

/**
 * 🛠 Give the DbSeeder class a generic slot, and call it TDatabase.
 *
 * Solution #4
 *
 * 🛠 In the return type of addUser, return DbSeeder but pass it a new
 * generic, which includes:
 *
 * 1. The current database.
 * 2. A users property, which extends the current database's users
 * property and also adds the new user with the id.
 *
 * Consider using `&` - the intersection type!
 *
 * Solution #5
 *
 * ⛔️ You should be seeing an error:
 *
 * Type '"users"' cannot be used to index type 'TDatabase'.
 *
 * We're accessing TDatabase['users']. If you don't constrain a
 * generic, TypeScript will treat it as 'unknown', and the
 * property 'users' doesn't exist on type 'unknown'.
 *
 * 🛠 We need to constrain our generic so that it has the property
 * 'users' on it, as well as 'posts' (to be future-safe).
 *
 * Consider re-using DbShape.
 *
 * Solution #6
 *
 * ✅ The error disappears!
 *
 * 🛠 Do the same trick on the addPost function.
 *
 * Solution #7
 */

/**
 * 🚁 Hover over .addUser above.
 *
 * .addUser("matt", {
 *  ^ 🚁
 *
 * You'll see that now, not only is "matt" being locked in to
 * the generic slot, but the return type now adds "matt" to the
 * users object.
 *
 * 🚁 Hover over result.
 *
 * const result = await new DbSeeder()
 *       ^ 🚁
 *
 * There's an issue, though - "matt" and "post1" are still not
 * in the result. They're being typed as just plain old Records.
 *
 * 🕵️‍♂️ See if you can work out why this is the case.
 *
 * Solution #8
 */

/**
 * 🚁 Hover over result. Hooray! We're now getting our inference.
 * "matt", "post1" and "post2" are all being added to the database.
 */

/**
 * 💡 Great job! We've looked at the builder pattern, generics inside
 * classes, and we now understand that generics can be attached to
 * individual functions on objects that are already generic!
 */

/**
 * 🕵️‍♂️ Stretch goal 1: consider how you might add a default user of "joel" to the
 * database.
 *
 * Solution #9
 *
 * 🕵️‍♂️ Stretch goal 2: consider how you might make the authorId type-safe:
 *
 * 1. You can only create a post with an authorId which corresponds to a
 * user you've already added.
 * 2. You can't create a post if you haven't created a user yet.
 */
