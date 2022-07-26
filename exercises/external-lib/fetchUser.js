export const fetchUser = (id) => {
  return Promise.resolve({
    id,
    firstName: "Matt",
    lastName: "Pocock",
    age: 30,
  });
};
