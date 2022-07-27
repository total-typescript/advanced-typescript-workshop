/**
 * #1
 *
 * const fetchPostWithMeta: WrapFunction<
 *   typeof fetchPost,
 *   { meta: { title: string; description: string } }
 * > = async (...args) => {
 *   const post = await fetchPost(...args);
 *
 *   return {
 *     ...post,
 *     meta: {
 *       title: post.title,
 *       description: post.body,
 *     },
 *   };
 * };
 *
 * #2
 *
 * type FuncParamsAsUnion = Parameters<typeof funcWithManyParameters>[number];
 */
