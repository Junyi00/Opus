import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { connect } from 'react-redux';

import TaskPage from './Components/TaskPage/TaskPage'
import NotFoundPage from './NotFoundPage'
import UserAuth from './Components/UserAuth/UserAuth';
import { fetchLoginStatus } from './actions/authActions';

class App extends React.Component {

  componentDidMount() {
    this.props.fetchLoginStatus();
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