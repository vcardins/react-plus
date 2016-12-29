/* @flow */

import { REQUEST_LOOKUP, GET_LOOKUP, RECIEVE_LOOKUP, SAVE_CURRENT_LOOKUP } from './Constants'
import initialStore from '../../store/initialStore';
// ------------------------------------
// Action Handlers
// ------------------------------------

const reducer = (state = initialStore, action) => {
    switch (action.type) {
      case 'GET_LOOKUP':
        return state;
      case 'RECIEVE_LOOKUP':
        return Object.assign({}, state, action.value, { updatedAt : new Date() } );
      default:
        return state;
    }
}

export default reducer;

// const LOOKUP_ACTION_HANDLERS = {
//   [REQUEST_LOOKUP]: (state: LookupStateObject) => {
//     return ({ ...state, fetching: true })
//   },
//   [RECIEVE_LOOKUP]: (state: LookupStateObject, action: {payload: LookupObject}): LookupStateObject => {
//     return ({ ...state, lookups: state.lookups.concat(action.payload), current: action.payload.id, fetching: false })
//   },
//   [SAVE_CURRENT_LOOKUP]: (state: LookupStateObject): LookupStateObject => {
//     return state.current != null ? ({ ...state, saved: state.saved.concat(state.current) }) : state
//   }
// }

// ------------------------------------
// Reducers
// ------------------------------------

// const initialState: LookupStateObject = { fetching: false, current: null, lookups: [], saved: [] }
// export default function lookupReducer (state: LookupStateObject = initialState, action: Action): LookupStateObject {
//   const handler = LOOKUP_ACTION_HANDLERS[action.type]
//
//   return handler ? handler(state, action) : state
// }

