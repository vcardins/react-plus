import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { IApplicationSettings, ApplicationSettings } from 'core/Settings';
import * as Enums from 'core/Enums';
import { Utils } from 'core/helpers/Utils';
import { OAuthService, OpenIdService, DataProvider } from 'core/Services';
import { AccessLevel, UserProfile } from 'core/Models';
import { LocalStorageProvider } from 'core/providers';
import { userRoles, accessLevels } from './access';

export class AuthResult {
    success: boolean = false;
    redirect:string;
    errorText: string = '';
    userInfo:any = null;
}

@autoinject
export class AuthService {

    private isAuth: boolean = false;
    private tokenName:string;
    private userInfoKey:string;
    private appSettings:IApplicationSettings;
    private publicUser:any = { username: '', role: userRoles.public };

    constructor(appSettings: ApplicationSettings, private localStorageProvider: LocalStorageProvider, private dataProvider:DataProvider,
        private http:HttpClient, private oAuthService: OAuthService, private openIdService: OpenIdService) {

        this.appSettings = appSettings.instance;
        this.tokenName = (this.appSettings.tokenPrefix ? `${this.appSettings.tokenPrefix}_` : '') + this.appSettings.tokenName;
        this.userInfoKey = (this.appSettings.tokenPrefix ? `${this.appSettings.tokenPrefix}_` : '') + 'user';
    }

    get isAuthenticated(): boolean {
        return !!this.token;
    }

    login(identifier: string, password: string, authMode?:Enums.AuthenticationTypes): Promise<AuthResult> {
        let self = this;
        let authResult = new AuthResult();
        let promise: Promise<AuthResult> = null;
        authMode = authMode || self.appSettings.authenticationMode;

        switch (self.appSettings.authenticationMode) {
            case Enums.AuthenticationTypes.OpenId:
                {
                    promise = new Promise<AuthResult>((resolve, reject) => {
                        self.openIdService.requestAccessToken(identifier, password).then(result => {
                            authResult.success = result.success;
                            authResult.errorText = result.errorText;
                            self.isAuth = authResult.success;
                            if (authResult.success) {
                                self.setToken(result.token);
                            }
                            resolve(authResult);
                        }).catch(error => {
                            authResult.success = false;
                            authResult.errorText = error.errorText;
                            reject(authResult);
                        });
                    });
                    break;
                }
            case Enums.AuthenticationTypes.OAuth:
                {
                    authResult.errorText = "Not yet implemented";
                    promise = new Promise<AuthResult>((resolve) => {
                        resolve(authResult);
                    });
                    break;
                }
            case Enums.AuthenticationTypes.Local:
                {

                    var grantContent = `grant_type=password`;
                    var userNameContent = `${"&username="}${identifier}`;
                    var passwordContent = `${"&password="}${password}`;
                    var clientId = `${"&client_id="}${this.appSettings.api.clientId}`;

                    var bodyContent = `${grantContent}${userNameContent}${passwordContent}${clientId}`;

                    promise = new Promise<AuthResult>((resolve, reject) => {
                        self.http
                            .createRequest(self.appSettings.api.loginUrl)
                            .withHeader('Content-Type', 'application/x-www-form-urlencoded')
                            .withContent(bodyContent)
                            .send()
                            .then(result => {
                                authResult.success = self.isAuth = result.isSuccess;
                                let info = result.content;
                                if (authResult.success) {
                                    self.setToken(info.access_token);
                                    self.setUser({username:info.username, id:1}, {title:info.role, bitMask: parseInt(info.bitMask)});
                                    authResult.redirect = self.appSettings.loginRedirect;
                                    authResult.userInfo = self.user;
                                }
                                resolve(authResult);
                            }).catch(error => {
                                authResult.success = false;
                                authResult.errorText = error.message;
                                reject(error);
                            });
                    });
                    break;
                }
            default:
                {
                    var defaultErrorText = 'Warning: Authentication mode not supported. Check ApplicationSettings';
                    console.error(defaultErrorText);

                    authResult.errorText = defaultErrorText;
                    promise = new Promise<AuthResult>((resolve) => {
                        resolve(authResult);
                    });
                }
        }
        return promise;
    }

    signup(data:any): Promise<AuthResult> {
        let self = this;
        let authResult = new AuthResult();
        return new Promise<AuthResult>((resolve, reject) => {
          self.http
              .createRequest(self.appSettings.api.signupUrl)
              .asPost()
              .withHeader('Content-Type', 'application/json; charset=utf-8')
              .withContent(data)
              .send()
              .then((result) => {
                resolve(result.content || {});
              }).catch((err) => {
                 reject(err);
              });
      });
    }

    authenticate(name:string, redirect:any, userData:any): Promise<AuthResult> {
         let authResult = new AuthResult();
         return new Promise<AuthResult>((resolve) => {
            resolve(authResult);
         });

  		// let provider:OAuth;
  		// provider = (this.config.providers[name].type === '1.0') ? this.oAuth1 : this.oAuth2;

  		// return provider.open(this.config.providers[name], userData || {}).then((response) => {
  		// 	this.auth.setToken(response, redirect);
  		// 	return response;
  		// })
  		// .catch((error)=> {
  		// 	console.log("auth problem");
  		// 	throw error;
  		// });
  	};

    setToken(token: string):void {
        this.localStorageProvider.set(this.tokenName, token);
    }

    setUser(u: any, level:any): void {
      u.accessLevel = level;
      let obj = Utils.getObjectProperties(u, ['id','admin','email','firstName','lastName','username','accessLevel']);
      let user = new UserProfile(obj).getOwnProperties(true);
      this.localStorageProvider.set(this.userInfoKey, JSON.stringify(user));
    }

    get token():string {
        return this.localStorageProvider.get(this.tokenName);
    }

    customToken(identifier:string):string {
        return this.localStorageProvider.get(identifier);
    }

    isAuthorized(accessLevel:AccessLevel, role:AccessLevel):boolean {
        role = (role || this.user.accessLevel) || this.publicUser.role;
        return accessLevel.bitMask <= role.bitMask;
    }

    get accessLevel():any {
        return this.user.accessLevel || accessLevels.public;
    }

    get user():UserProfile {
        let usr = JSON.parse(this.localStorageProvider.get(this.userInfoKey));
        return usr || this.publicUser;
    }

    unlinkProvider(name:string):Promise<void> {
        return null;
    }

    logout():Promise<AuthResult> {
        return new Promise<AuthResult>((resolve) => {
            this.clearToken();
            let authResult = new AuthResult();
            authResult.redirect = this.appSettings.logoutRedirect;
            authResult.success = true;
            resolve(authResult);
        });
    }

    clearToken(): void {
        this.localStorageProvider.remove(this.tokenName);
        this.localStorageProvider.remove(this.userInfoKey);
    }
}
