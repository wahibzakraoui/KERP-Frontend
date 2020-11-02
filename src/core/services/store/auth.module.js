import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
import UserService from "@/core/services/user.service";

import { UPDATE_PERSONAL_INFO, UPDATE_ACCOUNT_INFO } from "@/core/services/store/profile.module.js";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_PASSWORD = "updateUser";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_PASSWORD = "setPassword";
export const SET_ERROR = "setError";
export const SET_LOADING = "setLoading";

const state = {
  errors: {},
  isLoading: false,
  user: {},
  isAuthenticated: !!JwtService.getToken() && !!UserService.getPersonalInfo(),
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  isLoading(state) {
    return state.isLoading;
  }
};

const actions = {
  [LOGIN](context, credentials) {
    context.commit(SET_LOADING, true);
    return new Promise(resolve => {
      ApiService.post("auth/login", credentials)
        .then(({ data }) => {
          context.commit(SET_LOADING, false);
          context.commit(SET_ERROR, null);
          context.commit(SET_AUTH, data);
          const userInfo = {
            photo: data.user.identity.photo,
            name: data.user.identity.name.split(" ")[0],
            surname: data.user.identity.name.split(" ")[1],
            company_name: data.user.identity.company_name,
            job: data.user.identity.job,
            email: data.user.identity.email,
            phone: data.user.identity.phone,
            company_site: data.user.identity.company_name
          };
          const userAccountInfo = {
            username: data.user.identity.email,
            email: data.user.identity.email,
            language: data.user.identity.language,
            time_zone: data.user.identity.timezone,
            communication: {
              email: true,
              sms: true,
              phone: false
            },
            verification: data.user.identity.email_verified_at
          }
          context.dispatch(UPDATE_PERSONAL_INFO, userInfo);
          context.dispatch(UPDATE_ACCOUNT_INFO, userAccountInfo);
          resolve(data);
        })
        .catch(() => {
          context.commit(SET_LOADING, false);
          context.commit(SET_ERROR, "Connexion impossible, merci de reessayer.");
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("login", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(() => {
          context.commit(SET_ERROR, null);
        });
    });
  },
  [VERIFY_AUTH](context) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.get("auth/me")
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
        })
        .catch(() => {
          context.commit(SET_ERROR, null);
        });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [UPDATE_PASSWORD](context, payload) {
    const password = payload;

    return ApiService.put("password", password).then(({ data }) => {
      context.commit(SET_PASSWORD, data);
      return data;
    });
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = [error];
  },
  [SET_AUTH](state, user) {
    console.log(user.token);
    state.isAuthenticated = true;
    state.user = user;
    state.errors = {};
    JwtService.saveToken(user.user.token);
  },
  [SET_PASSWORD](state, password) {
    state.user.password = password;
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    JwtService.destroyToken();
  },
  [SET_LOADING](state, loadingState) {
    state.isLoading = loadingState;
  },
};

export default {
  state,
  actions,
  mutations,
  getters
};
