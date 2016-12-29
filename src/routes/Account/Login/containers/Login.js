import React, { PropTypes } from 'react';
import { UserAuth } from '../../../../core/helpers';
import LoginForm from '../components/LoginForm';
import axios from 'axios';

class Login extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        username: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);

    const API_URL = 'http://immiplanner.azurewebsites.net/token';
    const CLIENT_ID = '045A23D0-3859-42F1-A9CF-AE688EA0F030';

    this.ajax = axios.create({
       baseURL: API_URL
    });
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const username = encodeURIComponent(this.state.user.username);
    const password = encodeURIComponent(this.state.user.password);
    const GRANT_TYPE = 'password';
    const API_URL = 'http://immiplanner.azurewebsites.net/token';
    const CLIENT_ID = '045A23D0-3859-42F1-A9CF-AE688EA0F030';

    const formData = `username=${username}&password=${password}&grant_type=${GRANT_TYPE}&client_id=${CLIENT_ID}`;
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', API_URL);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      const resp = xhr.response;
      console.log(xhr.response);
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // {
        //   "access_token":"9scaBait-v1h4ma37M7YfdBR9xejrlZPq9DaiD1PuMIHOlilLDnw5wmNB2wfflo47TYyaVEZG9j6W2abm8IjdZoifMCR6emV5pRE0YLJcwoqx0vEBwXbdP2ttkxQZnzqXEjb4U7AixDEau7YSRMi458qTA3v1TlewL2lnxHUIoNieFf_glqcAehNu5fPx-rg4B21ZRlJsUDSsq8gFP_69x2TZZRzzzmm7jb28DGsk11LnEyfhx0OYUlUYVf5bOu_A6p7_Ls8xmqTMhrNND_s_MWhT8eV4TsdhMlid-68exjnKpHuFWucCOYzygClETEn5dvZiHSr2N-n_T3PFnvFBCXrdr_UuflrQo83nGtmfZN65suidzbynCU846bjXrd3CzHX_UPo-fjeXIIQ-53q7s4zQWwYYCv9k1gRkN-dbTtoZocqXatGtKKkBtWiJDwmaxcli1rl5w4xXTa1j7ecwCdl6mQxNyZ4VNcfD1k9rqnUuHoO9Ff0YR00LxKTL6SzJnkO3JssHCwV8zAml6pBTb749xvKeukB8b6Uot_76x_ZOqpSjn-5B5gRBxKhR_sm",
        //   "token_type":"bearer",
        //   "expires_in":1295999,
        //   "as:client_id":"045A23D0-3859-42F1-A9CF-AE688EA0F030",
        //   "username":"admin",
        //   "role":"Admin",
        //   "bitMask":"8",
        //   ".issued":"Wed, 28 Dec 2016 09:56:48 GMT",
        //   ".expires":"Thu, 12 Jan 2017 09:56:48 GMT"
        // }

        // save the token
        UserAuth.authenticate(resp.access_token);

        // change the current URL to /
        this.context.router.replace('/');
      } else {
        // failure

        // change the component state
        const errors = resp.error ? {error:resp.error} : {};
        errors.summary = resp.error_description;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
      />
    );
  }

}

Login.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Login;
