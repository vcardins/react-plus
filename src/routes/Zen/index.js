import { injectReducer } from '../../store/reducers';
import { UserAuth } from '../../core/helpers';

export default (store) => ({
  path: 'zen',
  onEnter: (nextState, replace) => UserAuth.checkAuth(nextState, replace, 10),
  getComponent (nextState, next) {
    require.ensure([
      './containers/ZenContainer',
      './modules/zen'
    ], (require) => {
      /*  These modules are lazily evaluated using require hook, and
      will not loaded until the router invokes this callback. */
      const Zen = require('./containers/ZenContainer').default
      const zenReducer = require('./modules/zen').default

      injectReducer(store, {
        key: 'zen',
        reducer: zenReducer
      })

      next(null, Zen)
    })
  }
})
