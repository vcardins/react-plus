/* @flow */
import React from 'react';
import classes from './Dashboard.scss';

import type { DashboardObject } from '../interfaces/dashboard';
import { Card, CardTitle, CardText } from 'material-ui/Card';

type Props = {
  zen: ?DashboardObject,
  saved: Array<DashboardObject>,
  fetchDashboard: Function,
  saveCurrentDashboard: Function
}

export const Dashboard = (props: Props) => (
  <Card className="container">
    <div>
      <h2 className={classes.zenHeader}>
        {props.zen ? props.zen.value : ''}
      </h2>
      <button className='btn btn-default' onClick={props.fetchDashboard}>
        Fetch a wisdom
      </button>
      {' '}
      <button className='btn btn-default' onClick={props.saveCurrentDashboard}>
        Save
      </button>
    </div>
    {props.saved.length
      ? <div className={classes.savedWisdoms}>
        <h3>
          Saved wisdoms
        </h3>
        <ul>
          {props.saved.map(zen =>
            <li key={zen.id}>
              {zen.value}
            </li>
          )}
        </ul>
      </div>
      : null
    }
  </Card>
)

Dashboard.propTypes = {
  zen: React.PropTypes.object,
  saved: React.PropTypes.array.isRequired,
  fetchDashboard: React.PropTypes.func.isRequired,
  saveCurrentDashboard: React.PropTypes.func.isRequired
}

export default Dashboard;
