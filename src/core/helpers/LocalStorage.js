import ApplicationSettings from '../settings';
import { LocalStorageTypes } from '../enums';

let instance = null;

class LocalStorage {

  constructor() {
    if(!instance){
      instance = this;
    }
    const localStorageMode = LocalStorageTypes.Local;

    switch (localStorageMode) {
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

    // to test whether we have singleton or not
    this.time = new Date()

    return instance;

  }

  get(key){
		return this.storage.getItem(key);
	}

	set(key, value){
		return this.storage.setItem(key, value);
	}

	remove(key){
		return this.storage.removeItem(key);
	}

}

const ls = new LocalStorage();

export { ls as LocalStorage };
