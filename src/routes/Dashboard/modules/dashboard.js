/* @flow */
import { Api } from '../../../core/helpers';
import type { DashboardObject, DashboardStateObject } from '../interfaces/dashboard.js'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_DASHBOARD = 'REQUEST_DASHBOARD'
export const RECIEVE_DASHBOARD = 'RECIEVE_DASHBOARD'
export const SAVE_CURRENT_DASHBOARD = 'SAVE_CURRENT_DASHBOARD'

// ------------------------------------
// Actions
// ------------------------------------

export function requestDashboard (): Action {
  return {
    type: REQUEST_DASHBOARD
  }
}

let availableId = 0
export function recieveDashboard (value: string): Action {
  console.log(value);
  return {
    type: RECIEVE_DASHBOARD,
    payload: {
      value,
      id: availableId++
    }
  }
}

export function saveCurrentDashboard (): Action {
  return {
    type: SAVE_CURRENT_DASHBOARD
  }
}

export const fetchDashboard = (): Function => {
  return (dispatch: Function): Promise => {
    //dispatch(requestDashboard())
    return Api.get('bookmark')
      .then(data => dispatch(recieveDashboard(data)));
  }
}

export const actions = {
  requestDashboard,
  recieveDashboard,
  fetchDashboard,
  saveCurrentDashboard
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const DASHBOARD_ACTION_HANDLERS = {
  [REQUEST_DASHBOARD]: (state: DashboardStateObject): DashboardStateObject => {
    return ({ ...state, fetching: true })
  },
  [RECIEVE_DASHBOARD]: (state: DashboardStateObject, action: {payload: DashboardObject}): DashboardStateObject => {
    return ({ ...state, zens: state.zens.concat(action.payload), current: action.payload.id, fetching: false })
  },
  [SAVE_CURRENT_DASHBOARD]: (state: DashboardStateObject): DashboardStateObject => {
    return state.current != null ? ({ ...state, saved: state.saved.concat(state.current) }) : state
  }
}

// ------------------------------------
// Reducers
// ------------------------------------

const initialState: DashboardStateObject = { fetching: false, current: null, zens: [], saved: [] }
export default function dashboardReducer (state: DashboardStateObject = initialState, action: Action): DashboardStateObject {
  const handler = DASHBOARD_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

