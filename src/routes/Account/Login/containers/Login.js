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

    UserAuth.authenticate(this.state.user.username, this.state.user.password)
      .then((response) => {
        // change the component-container state
        this.setState({errors: {}});
        this.context.router.replace('/');
      })
      .catch((error)=> {
          // change the component state
          const errors = resp.error ? {error:resp.error} : {};
          errors.summary = resp.error_description;

          this.setState({errors});
      });
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
