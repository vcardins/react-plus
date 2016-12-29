import React from 'react';
import { connect } from 'react-redux';
import Header from '../../components/Header';
import classes from './App.scss';
import '../../styles/core.scss';
import { fetchLookup } from './Actions';

class App extends React.Component {

  constructor(props) {
    super(props);
  }


  render () {

    return (
      <div className='container text-center'>
        <Header/>
        <div className={classes.mainContainer}>
          {this.props.children}
        </div>
      </div>
    )

    // return (
    //    <SplitPane
    //      left={
    //        <Contacts />
    //      }
    //      right={
    //        <Chat />
    //      } />
    //  );
  }

  componentDidMount(){
    this.props.fetchLookup(this.props.lookup.updatedAt);
  }

}

App.propTypes = {
  children: React.PropTypes.element.isRequired
}

const mapStateToProps = (state): { lookup: Any } => ({
  lookup: state.lookup,
})

const mapActionCreators: {fetchLookup: Function} = {
  fetchLookup
}

export default connect(mapStateToProps, mapActionCreators)(App);
