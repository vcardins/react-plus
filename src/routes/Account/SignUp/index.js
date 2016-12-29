import SignUp from './containers/SignUp'
import { UserAuth } from '../../../core/helpers';

export default {
  onEnter: (nextState, replace) => UserAuth.checkAuth(nextState, replace, 0),
  path: '/signup',
  component: SignUp
}
