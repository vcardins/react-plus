import ForgotPassword from './containers/ForgotPassword'
import { UserAuth } from '../../../core/helpers';

export default {
  onEnter: (nextState, replace) => UserAuth.checkAuth(nextState, replace, 0),
  path: '/forgot-password',
  component: ForgotPassword
}
