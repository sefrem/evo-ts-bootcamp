const addToLocalStorage = (key: string, item: unknown) =>
  localStorage.setItem(key, JSON.stringify(item));

const getFromLocalStorage = (key: string) =>
  JSON.parse(localStorage.getItem(key) as string);

export { addToLocalStorage, getFromLocalStorage };
