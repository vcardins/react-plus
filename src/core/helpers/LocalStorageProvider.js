/* @flow */

import ApplicationSettings from '../settings';
import { LocalStorageTypes } from '../enums';

export default class LocalStorageProvider {

  constructor() {

		switch (ApplicationSettings.localStorageMode) {
			case LocalStorageTypes.Local:
				this.storage = window.localStorage;
				if (!('localStorage' in window && window['localStorage'] !== null)) {
					console.warn('Warning: Local Storage is disabled or unavailable');
				}
				break;
			case LocalStorageTypes.Session:
				this.storage = window.sessionStorage;
				if (!('sessionStorage' in window && window['sessionStorage'] !== null)) {
					console.warn('Warning: Session Storage is disabled or unavailable. Will not work correctly.');
				}
			break;;
		}
  }

  get(key:string):Any{
		return this.storage.getItem(key);
	}

	set(key:string, value:Any):Any{
		return this.storage.setItem(key, value);
	}

	remove(key:string):Any{
		return this.storage.removeItem(key);
	}

}
