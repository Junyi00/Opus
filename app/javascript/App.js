import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { connect } from 'react-redux';

import TaskPage from './Components/TaskPage/TaskPage'
import NotFoundPage from './NotFoundPage'
import Signup from './Components/UserAuth/Signup';
import Login from './Components/UserAuth/Login';
import { fetchLoginStatus } from './actions/userActions';

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
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

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