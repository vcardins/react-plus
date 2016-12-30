/* @flow */

import ApplicationSettings from '../settings';

export class CookieStorage {

  constructor() {

  }

  get(key:string):Any{
		var keyX = key + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length; i++) {
		  var c = ca[i];
		  while (c.charAt(0)==' ') c = c.substring(1,c.length);
		    if (c.indexOf(keyX) == 0) return   c.substring(keyX.length,c.length);
		}
		return null;
	}

	set(key:string, value:Any, time:Date):Any{
		if (time) {
       var date = new Date();
       date.setTime(date.getTime()+(time*24*60*60*1000));
       var expires = "; expires="+date.toGMTString();
     }
     else var expires = "";
     document.cookie = key+"="+value+expires+"; path=/";
	}

	remove(key:string):Any{
		this.set(key, '', -1);
	}

}
