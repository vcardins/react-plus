import { UserAuth } from '../../../core/helpers';

export default {
  path: '/logout',
  onEnter: (nextState, replace) => {
    UserAuth.logout().then((response)=>{
      // change the current URL to
      console.log(response);
    });
    replace('/');
  }
}
