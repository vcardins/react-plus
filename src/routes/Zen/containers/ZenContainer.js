/* @flow */
import { connect } from 'react-redux';
import { fetchZen, saveCurrentZen } from '../modules/zen';

import Zen from '../components/Zen';

import type { ZenObject } from '../interfaces/zen';

import { fetchLookup } from '../../../layouts/App/Actions';

const mapActionCreators: {fetchZen: Function, saveCurrentZen: Function} = {
  fetchZen,
  fetchLookup,
  saveCurrentZen
}

const mapStateToProps = (state): { zen: ?ZenObject, lookup: Array<Any> , saved: Array<ZenObject> } => ({
  zen: state.zen.zens.find(zen => zen.id === state.zen.current),
  lookup: state.lookup,
  saved: state.zen.zens.filter(zen => state.zen.saved.indexOf(zen.id) !== -1)
})

export default connect(mapStateToProps, mapActionCreators)(Zen);
