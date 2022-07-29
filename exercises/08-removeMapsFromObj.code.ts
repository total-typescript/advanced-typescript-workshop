interface ApiData {
  "maps:longitude": string;
  "maps:latitude": string;
}

type RemoveMapsPrefixFromObj<TObj> = {
  [ObjKey in keyof TObj as RemoveMaps<ObjKey>]: TObj[ObjKey];
};

type RemoveMaps<TString> = TString extends `maps:${infer TSuffix}`
  ? TSuffix
  : TString;

export const removeMapsPrefixFromObj = <TObj>(
  obj: TObj,
): RemoveMapsPrefixFromObj<TObj> => {
  const newObj = {} as any;

  for (const key in obj) {
    if (key.startsWith("maps:")) {
      newObj[key.substring(5)] = obj[key];
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};
