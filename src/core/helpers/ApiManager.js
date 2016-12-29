/* @flow */

import 'whatwg-fetch';
import ApplicationSettings from '../settings/ApplicationSettings';
//import Utils from './Utils';

/**
  * Helper function to get "proper" end point url for sails backend API.
  *
  * @param   {string}    endPoint        Name of the end point
  * @param   {number}    [identifier]    Identifier of endpoint object
  *
  * @returns {string}
  * @private
  */
function parseEndPointUrl(endPoint:string, identifier:any) {
  return ApplicationSettings.api.url + '/' + endPoint + (identifier ? '/' + identifier : '');
}

/**
  * Helper function to parse used parameters in 'get' and 'count' methods.
  *
  * @param   {{}}    parameters  Used query parameters
  *
  * @returns {{params: {}}}
  * @private
  */
function parseParameters(parameters:any) {
  parameters = parameters || {};
  return { params: parameters };
}

export default class ApiManager {

  // static consctructor(){
  //   console.log('oops')
  // }
  /**
    * Service method to get count of certain end point objects.
    *
    * @param   {string}    endPoint    Name of the end point
    * @param   {{}}        parameters  Used query parameters
    *
    * @returns {Promise|*}
    */
  static count(route:string, data:Object = undefined) {
    return this.get(route + '/count/', data);
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
  static get(route:string, data:Object = undefined, headers:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route, 'GET', data, headers, anonymous);
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
  static getById(route:string, identifier:any, headers:Object = undefined, anonymous:boolean = false):Promise<any> {
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
  static post(route:string, data:Object = undefined, headers:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route, 'POST', data, headers, anonymous);
  }

  static patch(route:string, data:Object = undefined, headers:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route, 'PATCH', data, headers, anonymous);
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
    static put(route:string, data:Object = undefined, headers:Object = undefined, anonymous:boolean = false):Promise<any> {
      return this.request(route, 'PUT', data, headers, anonymous);
    }

  /**
    * Service method to delete specified object.
    *
    * @param   {string}    endPoint    Name of the end point
    * @param   {number}    identifier  Identifier of endpoint object
    *
    * @returns {Promise|*}
    */
  static delete(route:string, data:Object = undefined, headers:Object = undefined, anonymous:boolean = false):Promise<any> {
    return this.request(route, 'DELETE', data, headers, anonymous);
  }

  static plainRequest(route:string, httpRequestType:string, data:Object = undefined, headers:Object = undefined, anonymous:boolean = false):Promise<any> {
    this._isPlainRequest = true;
    return this.request(route, httpRequestType, data, headers, anonymous);
  }


  static request(route:string,
          httpRequestType:string,
          data:Object = {},
          headers:Object = undefined,
          anonymous:boolean = false):Promise<any>
    {
        debugger;
        console.log(ApplicationSettings, Utils);
        let req = this._getConfigRequest(route, httpRequestType, data, headers);
        let key = req.url.replace(ApplicationSettings.api.url + ApplicationSettings.api.prefix, '');

        if (this.deferredResult[key] && httpRequestType == 'GET') {
          return this.deferredResult[key];
        }

        let p:any = fetch(req.url);
        if (!anonymous) {
          p = p.withToken();
        }

        switch(httpRequestType) {
          case 'GET' : p = p.asGet(); break;
          case 'POST' : p = p.asPost().withContent(data); break;
          case 'PUT' : p = p.asPut().withContent(data); break;
          case 'PATCH' : p = p.asPatch().withContent(data); break;
          case 'DELETE' : p = p.asDelete(); break;
        }

        return this.deferredResult[key] = new Promise((resolve, reject) => {
              p.send().then(result => {
                if (result)
                  resolve(result.content);
                else
                  reject(undefined);
              });
          });
    }

    static _getConfigRequest(route:string, httpRequestType:string, data:any, headers:any):IConfigRequest {

        var configRequest = {
            url: this._urlCompile(route, data, true),
            headers: headers || { 'Content-Type': this._contentType || ApplicationSettings.api.contentType },
            params: {},
            data:{}
        };

        if (typeof (data) === 'object' && data.constructor.name === 'FormData') {
            configRequest.headers = { 'Content-Type': undefined };
        }
        if (httpRequestType === 'GET' || httpRequestType === 'DELETE') {
            configRequest.params = Object.assign({}, configRequest.params, data);
        } else {
            if (configRequest.headers['Content-Type'] === ApplicationSettings.api.contentType) {
                configRequest.data = this._serialize(data, '');
            } else {
                configRequest.data = data;
            }
        }

        return configRequest;
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
      let result = `${ApplicationSettings.api.url}/${ApplicationSettings.api.prefix}/${url}`;
      this._isPlainRequest = false;
      return result;
    }
}