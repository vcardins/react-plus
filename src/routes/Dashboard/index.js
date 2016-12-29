import { injectReducer } from '../../store/reducers';
import { UserAuth } from '../../core/helpers';

export default (store) => ({
  path: 'dashboard',
  onEnter: (nextState, replace) => UserAuth.checkAuth(nextState, replace, 10),
  getComponent (nextState, next) {
    require.ensure([
      './containers/DashboardContainer',
      './modules/dashboard'
    ], (require) => {
      /*  These modules are lazily evaluated using require hook, and
      will not be loaded until the router invokes this callback. */
      const Dashboard = require('./containers/DashboardContainer').default
      const dashboardReducer = require('./modules/dashboard').default

      injectReducer(store, {
        key: 'dashboard',
        reducer: dashboardReducer
      })

      next(null, Dashboard)
    })
  }
})
