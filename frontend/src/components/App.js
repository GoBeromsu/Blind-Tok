import React,{ useEffect, useState ,Component } from 'react';

import { connect } from 'react-redux';
import './style/App.css';
import SideBar from './SideBar';
import ToggleSidebar from './ToggleSidebar'

class App extends Component {
  render() {
    return (
      <div>
            { <SideBar/>}
            <ToggleSidebar/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    counter: state.counter
  }
}

export default connect(mapStateToProps)(App);