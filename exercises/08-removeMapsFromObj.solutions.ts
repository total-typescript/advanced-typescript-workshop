/**
 * #1
 *
 * type RemoveMaps<TString> = TString extends `maps:${string}` ? TString : TString;
 *
 * 💡 `maps:${string}` is a way of expressing _any_ string
 * which starts with "maps:". It's kind of like a regex.
 *
 * #2
 *
 * type RemoveMaps<TString> = TString extends `maps:${infer TRest}`
 *   ? TRest
 *   : TString;
 *
 * #3
 *
 * type RemoveMapsPrefixFromObj<TObj> = {
 *   [Key in keyof TObj]: TObj[Key];
 * };
 *
 * #4
 *
 * type PostRemoved<TString> = TString extends `${infer TPrefix}:post`
 *   ? TPrefix
 *   : TString;
 *
 * #5
 *
 * type AddNewKeys<TObj> = {
 *   [Key in keyof TObj as Key extends string ? `${Key}_new` : never]: T[Key];
 * };
 *
 * The conditional inside the index is needed because keyof can return a
 * symbol, which can't be applied to a template literal.
 */
