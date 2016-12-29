/* @flow */
import { connect } from 'react-redux';
import { fetchDashboard, saveCurrentDashboard } from '../modules/dashboard';

import Dashboard from '../components/Dashboard';
import type { DashboardObject } from '../interfaces/dashboard';

const mapActionCreators: {fetchDashboard: Function, saveCurrentDashboard: Function} = {
  fetchDashboard,
  saveCurrentDashboard
}

const mapStateToProps = (state): { dashboard: ?DashboardObject, saved: Array<DashboardObject> } => ({
  dashboard: state.dashboard.zens.find(dashboard => dashboard.id === state.dashboard.current),
  saved: state.dashboard.zens.filter(dashboard => state.dashboard.saved.indexOf(dashboard.id) !== -1)
})

export default connect(mapStateToProps, mapActionCreators)(Dashboard)
