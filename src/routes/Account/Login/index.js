import Login from './containers/Login'
import { UserAuth } from '../../../core/helpers';

export default {
  onEnter: (nextState, replace) => UserAuth.checkAuth(nextState, replace, 0),
  path: '/login',
  component: Login
}
