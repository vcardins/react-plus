export default class UserAuth {

  //var tokenName = 'token';
  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static authenticate(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticate() {
    localStorage.removeItem('token');
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return localStorage.getItem('token');
  }

  static checkAuth(nextState, replace, accessLevel) {
    
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

}
