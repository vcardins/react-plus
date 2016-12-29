/* @flow */

import { REQUEST_LOOKUP, GET_LOOKUP, RECIEVE_LOOKUP, SAVE_CURRENT_LOOKUP } from './Constants'

// ------------------------------------
// Actions
// ------------------------------------

export function getLookup (): Action {
  return {
    type: GET_LOOKUP
  }
}

export function recieveLookup (value: object): Action {
  return {
    type: RECIEVE_LOOKUP,
    value
  }
}

export const fetchLookup = (updatedAt:Date): Function => {
  return (dispatch: Function): Promise => {    
    if (!!updatedAt) {
      dispatch(getLookup());
    } else {
      return fetch('http://immiplanner.azurewebsites.net/api/lookup')
        .then(data => data.json())
        .then(json => dispatch(recieveLookup(json)))

    }
  }
}
