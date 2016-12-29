import { UserAuth } from '../../../core/helpers';

export default {
  path: '/logout',
  onEnter: (nextState, replace) => {
    UserAuth.deauthenticate();

    // change the current URL to /
    replace('/');
  },
  anon: true
}
