interface User {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  authorId: string;
}

interface DbShape {
  users: Record<string, User>;
  posts: Record<string, Post>;
}

export class DbSeeder<TDatabase extends DbShape> {
  public users: DbShape["users"] = {};
  public posts: DbShape["posts"] = {};

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
};
