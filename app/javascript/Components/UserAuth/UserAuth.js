import React, { Component } from "react";
import styled from "styled-components";
import Header from "../TaskPage/Header";
import { Tab } from '@headlessui/react'
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { addUser, loginUser, logoutUser } from '../../actions/authActions';
import Signup from "./Signup";
import Login from "./Login";

const BaseDiv = styled.div`
  position: absolute;
  top: var(--header-height);
  bottom: 0px;
  left: 0px;
  right: 0px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ContentDiv = styled.div`
  width: fit-content;
  height: fit-content;
  padding: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  
  box-shadow: rgba(100, 100, 111, 0.1) 0px 0px 29px 0px;
  background-color: transparent;
  border: 1px solid var(--light-gray); 
  border-radius: 10px;
`

const TabListStyle = {
  padding: '5px',
  borderRadius: '10px',
  backgroundColor: 'transparent',
  border: '1px solid var(--highlight-color)'
}

const TabBtnStyle = {
  padding: '5px',
  borderRadius: '10px',
}

class UserAuth extends Component {

  constructor(props) {
    super(props)
    this.state = {
      signUpSuccess: false,
    }
  }

  loginActionOnClick = (data) => {
    this.props.loginUser(data, ()=>{console.log('success')});
  }
  
  signupActionOnClick = (data) => {
    this.props.addUser(data, ()=>{this.setState({signUpSuccess:true})});
  }

  render() {
    return (
      <React.Fragment>
        { this.props.user.isLoggedIn && (<Navigate to="/" replace={true} />)}
        <Header 
          projectLoaded={null}
          searchQuery=''
        />
        <BaseDiv>
          <ContentDiv>
              <Tab.Group>
                <Tab.List style={TabListStyle}>
                  <Tab
                    style={TabBtnStyle}
                    className={({ selected }) =>
                      selected ? 'bg-transparent text-highlight' : 'bg-transparent text-gray'
                    }
                  >Login</Tab>
                  <Tab
                    style={TabBtnStyle}
                    className={({ selected }) =>
                      selected ? 'bg-transparent text-highlight' : 'bg-transparent text-gray'
                    }
                  >Sign Up</Tab>
                </Tab.List>
                <Tab.Panel style={{padding:'10px'}}>
                  <Login
                    loginOnClick={this.loginActionOnClick}
                    errorState={this.props.errors}
                  />
                </Tab.Panel>
                <Tab.Panel style={{padding:'10px'}}>
                  <Signup 
                    signupOnClick={this.signupActionOnClick} 
                    successState={this.state.signUpSuccess}
                    errorState={this.props.errors}
                  />
                </Tab.Panel>
              </Tab.Group>
          </ContentDiv>
        </BaseDiv>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  user: state.user
});

const mapDispatchToProps = dispatch => {
    return {
      addUser: (...args) => { dispatch(addUser(...args)) },
      loginUser: (...args) => { dispatch(loginUser(...args)) },
      logoutUser: (...args) => { dispatch(logoutUser(...args)) }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAuth)