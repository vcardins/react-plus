import React from 'react';
import { connect } from 'react-redux';
import DuckImage from '../assets/Duck.jpg';
import classes from './HomeView.scss';
import { Card, CardTitle } from 'material-ui/Card';

class HomeView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const listItems = this.props.availabilityStatuses.map((item, i) => (
      <li key={item.id}>{item.name}</li>
    ));

    return (
      <Card className="container">
        <h4>Welcome!</h4>
        <img
          alt='This is a duck, because Redux!'
          className={classes.duck}
          src={DuckImage} />
        <CardTitle title="React Application" subtitle="This is the home page." />
        <ul>
            {listItems}
        </ul>
      </Card>
    )
  }

  componentDidMount() {
    //console.log(this.props.availabilityStatuses);
  }

}

function mapStateToProps(state) {
  return {
    countries : state.lookup.countries,
    availabilityStatuses : state.lookup.availabilityStatuses
  }
}

function mapActionCreators() {
  return {};
}

export default connect(mapStateToProps, mapActionCreators)(HomeView);
