/* @flow */
import React from 'react';
import classes from './Zen.scss';

import type { ZenObject } from '../interfaces/zen';

type Props = {
  zen: ?ZenObject,
  saved: Array<ZenObject>,
  fetchZen: Function,
  fetchLookup: Function,
  saveCurrentZen: Function
}

class Zen extends React.Component {

  constructor(props: Props) {
    super(props);
  }

  render () {
    return (
      <div>
        <div>
          <h2 className={classes.zenHeader}>
            {this.props.zen ? this.props.zen.value : ''}
          </h2>
          <button className='btn btn-default' onClick={this.props.fetchZen}>
            Fetch a wisdom
          </button>
          {' '}
          <button className='btn btn-default' onClick={this.props.saveCurrentZen}>
            Save
          </button>
        </div>
        {this.props.saved.length
          ? <div className={classes.savedWisdoms}>
            <h3>
              Saved wisdoms
            </h3>
            <ul>
              {this.props.saved.map(zen =>
                <li key={zen.id}>
                  {zen.value}
                </li>
              )}
            </ul>
          </div>
          : null
        }
      </div>
    )
  }

  componentDidMount(){
    this.props.fetchLookup(this.props.lookup.updatedAt);
  }

}

Zen.propTypes = {
  zen: React.PropTypes.object,
  saved: React.PropTypes.array.isRequired,
  fetchZen: React.PropTypes.func.isRequired,
  fetchLookup: React.PropTypes.func.isRequired,
  saveCurrentZen: React.PropTypes.func.isRequired
}

export default Zen;
