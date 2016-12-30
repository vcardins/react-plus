// We only need to import the modules necessary for initial render
import App from '../layouts/App/App';
import Home from './Home';
import Dashboard from './Dashboard';
import { injectReducer } from '../store/reducers';
import { UserAuth } from '../core/helpers';

const isAuthenticated = UserAuth.isAuthenticated();

export const createRoutes = (store) => {
/*  Note: Instead of using JSX, we are using react-router PlainRoute,
    a simple javascript object to provide route definitions.
    When creating a new async route, pass the instantiated store!   */

  const routes = {
    path: '/',
    // component: App,
    getComponent (nextState, next) {
      require.ensure([
        '../layouts/App',
        '../layouts/App/Reducer'
      ], (require) => {
        /*  These modules are lazily evaluated using require hook, and
        will not loaded until the router invokes this callback. */
        const App = require('../layouts/App').default
        const appReducer = require('../layouts/App/Reducer').default

        injectReducer(store, {
          key: 'lookup',
          reducer: appReducer
        })

        next(null, App)
      })
    },
    //indexRoute: Home, //!flag ? Home : Dashboard,
    getIndexRoute(nextState, next) {
      require.ensure([
        './Home',
        './Dashboard'
      ], function (require) {

        // if (isAuthenticated) {
        //   const View = Dashboard;
        //   next(null, View);
        // } else {
          const View = require('./Home').default;
          next(null, View);
        // }

      })
    },
    getChildRoutes (location, next) {
      require.ensure([], (require) => {
        next(null, [
          // Provide store for async reducers and middleware
          require('./Counter').default(store),
          require('./Zen').default(store),
          require('./Dashboard').default(store),
          require('./Account/Login').default,
          require('./Account/Logout').default,
          require('./Account/SignUp').default,
          require('./Account/ForgotPassword').default,
          require('./NotFound').default
        ])
      })
    }
  }

  return routes
}

export default createRoutes;
