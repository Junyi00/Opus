import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { connect } from 'react-redux';
import { fetchLoginStatus } from './actions/authActions';

import TaskPage from './components/TaskPage'
import NotFoundPage from './NotFoundPage'
import UserAuth from './components/UserAuth';
import ResetPassword from './components/ResetPassword';
import axios from 'axios';

class App extends React.Component {

  componentDidMount() {
    this.props.fetchLoginStatus();

    // Set CSRF token for all axios request
    axios.defaults.headers.common['X-CSRF-Token'] = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  }

  error = () => {
    return this.props.errors.length > 0
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<TaskPage />} />
          <Route path="/home" element={<UserAuth />} />
          <Route path="/reset" element={<ResetPassword />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});
const mapDispatchToProps = dispatch => {
  return {
      fetchLoginStatus: () => { 
        dispatch(fetchLoginStatus()) 
      }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(App);