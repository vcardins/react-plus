
import ApplicationSettings from '../settings';
import { LocalStorage } from './LocalStorage';
import Api from './Api';
import Utils from './Utils';
import { userRoles, accessLevels } from './Access';

class UserAuth {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  authenticate(identifier: string, password: string) {
      let self = this;
      let promise = null;

      const grantContent = `grant_type=${ApplicationSettings.api.grantType}`;
      const userNameContent = `${"&username="}${identifier}`;
      const passwordContent = `${"&password="}${password}`;
      const clientId = `${"&client_id="}${ApplicationSettings.api.clientId}`;

      const bodyContent = `${grantContent}${userNameContent}${passwordContent}${clientId}`;
      let authResult = {};

      return new Promise((resolve, reject) => {
          Api
              .plainRequest(ApplicationSettings.api.loginUrl, 'POST', bodyContent, 'application/x-www-form-urlencoded', true)
              .then(result => {
                authResult.success = !!result.access_token;
                if (authResult.success) {
                    self.setToken(result.access_token);
                    self.setUser({username:result.username}, {title:result.role, bitMask: parseInt(result.bitMask)});
                    authResult.redirect = ApplicationSettings.loginRedirect;
                    authResult.userInfo = self.user;
                }
                resolve(authResult);
              }).catch(error => {
                  authResult.success = false;
                  authResult.errorText = error.message;
                  reject(authResult);
              });
      });
  }
  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  deauthenticate() {
    LocalStorage.remove(this.tokenKey);
  }

  get userKey() {
    return `${ApplicationSettings.tokenPrefix}_user`;
  }

  get tokenKey() {
    return `${ApplicationSettings.tokenPrefix}_${ApplicationSettings.tokenName}`;
  }

  get user() {
    let usr = JSON.parse(LocalStorage.get(this.userKey));
    return usr;
  }

  setUser(user: any, level:any): void {
    user.accessLevel = level;
    LocalStorage.set(this.userKey, JSON.stringify(user));
  }

  setToken(token) {
    return LocalStorage.set(this.tokenKey, token);
  }
  /**
   * Get a token value.
   *
   * @returns {string}
   */

 get publicUser() {
   return { username: '', role: userRoles.public };
 }

  getToken() {
    return LocalStorage.get(this.tokenKey);
  }

  get token():string {
      return LocalStorage.get(this.tokenKey);
  }

  isAuthorized(accessLevel, role) {
    role = (role || this.user.accessLevel) || this.publicUser.role;
    return accessLevel.bitMask <= role.bitMask;
  }

  get accessLevel() {
    return this.user.accessLevel || accessLevels.public;
  }

  checkAuth(nextState, replace, accessLevel) {

    const isAuth = this.isAuthenticated();

    if ( (accessLevel > 0 && !isAuth) || (accessLevel == 0 && isAuth) ) {
      replace({
        pathname : '/',
        state : { nextPathname : nextState.location.pathname }
      });
    }

    if (isAuth && nextState.location.pathname == '/') {
      replace({
        pathname : '/dashboard',
        state : { nextPathname : nextState.location.pathname }
      });
    }

  }

  logout() {
      return new Promise((resolve, reject) => {
          this.clearToken();
          let authResult = {};
          authResult.redirect = ApplicationSettings.logoutRedirect;
          authResult.success = true;
          resolve(authResult);
      });
  }

  clearToken(): void {
      LocalStorage.remove(this.tokenKey);
      LocalStorage.remove(this.userKey);
  }

}

const u = new UserAuth();
export { u as UserAuth };