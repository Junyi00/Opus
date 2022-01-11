import React, { Component } from "react";
import styled from "styled-components";
import Header from "../TaskPage/Header";
import { Tab } from '@headlessui/react'
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

import Signup from "./Signup";
import Login from "./Login";
import OpusIcon from 'images/Opus_Icon.png'

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
  overflow: hidden; // prevent scrolling due to large bg img size
`

const ContentDiv = styled.div`
  max-width: 80%;
  width: fit-content;
  height: fit-content;
  padding: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  
  box-shadow: rgba(100, 100, 111, 0.1) 0px 0px 29px 0px;
  background-color: white;
  border: 1px solid var(--light-gray); 
  border-radius: 10px;
  
  opacity: 90%;
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
          <img style={{position:'absolute', opacity:'10%', width:'80%', zIndex:'-1'}} src={OpusIcon} />
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
                  loginErrorState={this.props.errors.login}
                />
              </Tab.Panel>
              <Tab.Panel style={{padding:'10px'}}>
                <Signup 
                  signupErrorState={this.props.errors.signup}
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

export default connect(mapStateToProps, null)(UserAuth)