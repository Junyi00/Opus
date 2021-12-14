import React from "react";
import styled from 'styled-components'

import OpusLogo from 'images/Opus_Logo.png'

const HeaderBase = styled.div`
  background-color: #fcfcfc;
  border-bottom: 1px solid gray;

  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;

  flex: 0 1 auto;
  overflow: hidden;

  display: inline-flex; 
  flex-direction: horizontal; 
  justify-content: space-between; 
  align-items: center;
  width: 100%
`

const Logo = styled.img`
  float: left;
  width: 10%;
`

const UserInfo = styled.div`
  float: right;
  width: 10%;

  text-align: center;
`

const Header = () => {
  return (
    <HeaderBase>
      <Logo src={OpusLogo}></Logo>
      <UserInfo>
        <a style={{fontSize: '10px'}}>Logged in:</a><br />
        <b>System</b>
      </UserInfo>
    </HeaderBase>
  )
}

export default Header