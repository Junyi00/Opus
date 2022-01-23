import React, { useState } from "react";
import styled from "styled-components";
import Header from "../Header";
import { Tab } from '@headlessui/react'
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

import Signup from "./Signup";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import OpusIcon from 'images/Opus_Icon.png'
import OpusLogo from 'images/Opus_Logo.png'

const BaseDiv = styled.div`
  position: absolute;
  // top: var(--header-height);
  top: 0px;
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
  // border: '1px solid var(--highlight-color)'
}

const TabBtnStyle = {
  padding: '5px',
  borderWidth: '0px 0px 1px 0px'
}

const UserAuth = ({ user }) => {
  const [showResetTab, setShowResetTab] = useState(false)

  return (
    <React.Fragment>
      { user.isLoggedIn && (<Navigate to="/" replace={true} />)}
      {/* <Header 
        projectLoaded={null}
        searchQuery=''
      /> */}
      <BaseDiv>
        <img style={{position:'absolute', opacity:'10%', width:'60%', zIndex:'-1'}} src={OpusIcon} />
        <ContentDiv>
          <img style={{width:'150px', zIndex:'-1'}} src={OpusLogo} />
          <Tab.Group>
            <Tab.List style={TabListStyle}>
              <Tab
                style={TabBtnStyle}
                className={({ selected }) =>
                  selected ? 'border-highlight-color text-highlight' : 'border-light-gray-color text-gray-500'
                }
              >Login</Tab>
              <Tab
                style={TabBtnStyle}
                className={({ selected }) =>
                  selected ? 'border-highlight-color text-highlight' : 'border-light-gray-color text-gray-500'
                }
              >Sign Up</Tab>
              { showResetTab && 
                <Tab
                  style={TabBtnStyle}
                  className={({ selected }) =>
                    selected ? 'border-highlight-color text-highlight' : 'border-light-gray-color text-gray-500'
                  }
                >
                  Reset
                </Tab>
              }
              
            </Tab.List>
            
            <Tab.Panel style={{padding:'10px'}}>
              <Login 
                setShowResetTab={setShowResetTab}
              />
            </Tab.Panel>
            <Tab.Panel style={{padding:'10px'}}>
              <Signup />
            </Tab.Panel>
            { showResetTab && 
              <Tab.Panel style={{padding:'10px'}}>
                <ResetPassword />
              </Tab.Panel>
            }
            
          </Tab.Group>
        </ContentDiv>
      </BaseDiv>
    </React.Fragment>
  )

}

export default connect(
  (state) => ({
    user: state.user
  }), 
  null
)(UserAuth)