/* @flow */

export type DashboardObject = {
  id: number,
  value: string
}

export type DashboardStateObject = {
  current: ?number,
  fetching: boolean,
  saved: Array<number>,
  zens: Array<DashboardObject>
}

