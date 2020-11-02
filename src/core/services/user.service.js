const PERSONAL_INFO = "PERSONAL_INFO";
const ACCOUNT_INFO = "ACCOUNT_INFO";
// getting data
export const getPersonalInfo = () => {
  return JSON.parse(window.localStorage.getItem(PERSONAL_INFO));
};
export const getAccountInfo = () => {
    return JSON.parse(window.localStorage.getItem(ACCOUNT_INFO));
};
// saving data
export const saveUserPI = (personal_data) => {
  window.localStorage.setItem(PERSONAL_INFO, JSON.stringify(personal_data));
};
export const saveUserAI = (account_data) => {
  window.localStorage.setItem(ACCOUNT_INFO, JSON.stringify(account_data));
};
// deleting data
export const destroyUser = () => {
  window.localStorage.removeItem(PERSONAL_INFO);
  window.localStorage.removeItem(ACCOUNT_INFO);
};

export default { getPersonalInfo, getAccountInfo, saveUserPI, saveUserAI, destroyUser };
