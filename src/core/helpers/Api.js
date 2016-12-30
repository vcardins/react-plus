/* @flow */

import 'whatwg-fetch';

import ApplicationSettings from '../settings';
import Utils from './Utils';
import { UserAuth } from './UserAuth';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

export default class Api {

  /**
    * Service method to get count of certain end point objects.
    *
    * @param   {string}    endPoint    Name of the end point
    * @param   {{}}        parameters  Used query parameters
    *
    * @returns {Promise|*}
    */
  static count(route:string, data:Object = undefined) {
    return this.get(route + '/count', data);
  }

  static find(route:string, prop:string, value:any):Promise<any> {
    return this.get(route, 'GET').then(data => {
      return data.filter((item:any) => {
        return item[prop] == value;
      })[0];
    });
  }

  /**
    * Service method to get data from certain end point. This will always return a collection
    * of data.
    *
    * @param   {string}    endPoint    Name of the end point
    * @param   {{}}        parameters  Used query parameters
    *
    * @returns {Promise|*}
    */
  static get(route:string, data:Object = undefined, contentType:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route, 'GET', data, contentType, anonymous);
  }

  /**
    * Service method to get data from certain end point. This will always return a collection
    * of data.
    *
    * @param   {string}    endPoint    Name of the end point
    * @param   {{}}        parameters  Used query parameters
    *
    * @returns {Promise|*}
    */
  static getById(route:string, identifier:any, contentType:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route + '/' + identifier, 'GET', undefined, headers, anonymous);
  }

  /**
    * Service method to create new object to specified end point.
    *
    * @param   {string}    endPoint    Name of the end point
    * @param   {{}}        data        Data to update
    *
    * @returns {Promise|*}
    */
  static post(route:string, data:Object = undefined, contentType:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route, 'POST', data, contentType, anonymous);
  }

  static patch(route:string, data:Object = undefined, contentType:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route, 'PATCH', data, contentType, anonymous);
  }

  static upload(route:string, data:Object = undefined, contentType:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route, 'UPLOAD', data, contentType, anonymous);
  }

  /**
    * Service method to update specified end point object.
    *
    * @param   {string}    endPoint    Name of the end point
    * @param   {number}    identifier  Identifier of endpoint object
    * @param   {{}}        data        Data to update
    *
    * @returns {Promise|*}
    */
  static put(route:string, data:Object = undefined, contentType:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route, 'PUT', data, contentType, anonymous);
  }

  /**
    * Service method to delete specified object.
    *
    * @param   {string}    endPoint    Name of the end point
    * @param   {number}    identifier  Identifier of endpoint object
    *
    * @returns {Promise|*}
    */
  static delete(route:string, data:Object = undefined, contentType:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route, 'DELETE', data, null, anonymous);
  }

  static plainRequest(route:string, httpRequestType:string, data:Object = undefined, contentType:Object = undefined, anonymous:boolean = false):Promise<any> {
    this._isPlainRequest = true;
    return this.request(route, httpRequestType, data, contentType, anonymous);
  }

  static request(route:string,
          httpRequestType:string,
          data:Object = {},
          contentType:Object = undefined,
          isAnonymous:boolean = false):Promise<any>
    {
        let url = this._urlCompile(route, data, true);

        contentType = contentType || ApplicationSettings.api.contentType;

        if (typeof (data) === 'object' && data.constructor.name === 'FormData') {
          contentType = undefined;
        }

        let configRequest = {
            method : httpRequestType,
            headers: { 'Content-Type': contentType },
        };

        switch (httpRequestType) {
          case 'GET':
          case 'DELETE':
            const params = this._serialize(data);
            if (params) {
              url += '?' + params;
            }
            break;
          case 'PUT':
          case 'PATCH':
          case 'POST':
            if (data.constructor.name === 'FormData') {
              configRequest.body = new FormData(data);
            } else {
              configRequest.body = typeof(data) == 'object' ? JSON.stringify(data) : data;
            }
            break;
        }

        if (!isAnonymous) {
          if (ApplicationSettings.authHeader && ApplicationSettings.authToken) {
              let token = UserAuth.getToken();
              let authHeader = `${ApplicationSettings.authToken} ${token}`;
              configRequest.headers[ApplicationSettings.authHeader] = authHeader;
            }
        }

        return new Promise((resolve, reject) => {
            fetch(url, configRequest)
              .then(checkStatus)
              .then(parseJSON)
              .then(result => {
                resolve(result);
              })
              .catch(error => {
                reject(error);
              });
        });
    }

    static _serialize(obj:any, prefix:string):string {
      let queryString:string[] = [];
      for (let p in obj) {
          let k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
          queryString.push(typeof v === 'object' ?
              this._serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }
      return queryString.join('&');
    }

    static _urlCompile(url:string, parameters:any, isReplace:boolean):string {
      if (!url) { return; }
      if (Array.isArray(url)) { url = url[0]; }
      for (let name in parameters) {
          if (url.indexOf(':' + name) > -1) {
              let value = parameters[name];
              if (!value) {
                  console.error('Router: No path replacement value for ' + name + '.', url, parameters);
              }
              url = url.replace(':' + name, value);
              if (isReplace) {
                  delete parameters[name];
              }
          }
      }
      let result = ApplicationSettings.api.url + (this._isPlainRequest ? '' :  `/${ApplicationSettings.api.prefix}`) + `/${url}`;
      this._isPlainRequest = false;
      return result;
    }
}