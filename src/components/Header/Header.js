import React from 'react';
import { UserAuth } from '../../core/helpers';
import { IndexLink, Link } from 'react-router';
import classes from './Header.scss';

export const Header = () => (
  <div>
    <h1>React Redux Starter Kit</h1>
    <IndexLink to='/' activeClassName={classes.activeRoute}>
      Home
    </IndexLink>
    {' · '}
    <Link to='/counter' activeClassName={classes.activeRoute}>
      Counter
    </Link>
    { !UserAuth.isAuthenticated() ?
      (
        <span>
          {' · '}
          <Link to='/login' activeClassName={classes.activeRoute}>
            Login
          </Link>
          {' · '}
          <Link to='/signup' activeClassName={classes.activeRoute}>
            Sign Up
          </Link>
          {' · '}
          <Link to='/forgot-password' activeClassName={classes.activeRoute}>
            Forgot Password
          </Link>
        </span>
      )
    :
      (
        <span>
          {' · '}
          <Link to='/zen' activeClassName={classes.activeRoute}>
            Zen
          </Link>
          {' · '}
          <Link to='/dashboard' activeClassName={classes.activeRoute}>
            Dashboard
          </Link>
          {' · '}
          <Link to='/logout' activeClassName={classes.activeRoute}>
            Logout
          </Link>
        </span>
      )
    }
  </div>
)

export default Header;
