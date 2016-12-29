import 'whatwg-fetch';

/**
 * Usage:
 *  GeoLocationIpService.get().then((data)=> {
    if ( data instanceof Error ) {
      console.error(data);
     } else {
      console.info(data);
     }
   })
 */
class GeoLocationIpService {

  static get(format = "json", domain = null) {

    let url = `//freegeoip.net/${format}` + ( domain ? `/${domain}` : '');

    return fetch(url)
      .then(result => {
        return JSON.parse(result.response);
      })
      .catch(error => {
        return new Error(error);
      });

  }

}

export default GeoLocationIpService;