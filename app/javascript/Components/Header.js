import React from "react";
import styled from 'styled-components'

import OpusLogo from 'images/Opus_Logo.png'

const HeaderBase = styled.header`
  background-color: #fcfcfc;
  // border-bottom: 1px solid var(--light-gray);
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  // padding: 5px;

  flex: 0 1 auto;
  overflow: hidden;

  display: flex; 
  flex-direction: horizontal; 
  justify-content: space-between; 
  align-items: center;

  position: fixed;
  top: 0;
  width: 100%;
  height: var(--header-height);
  z-index: 1;
`

const Logo = styled.img`
  width: 10%;
  padding: 5px;
`

const UserInfo = styled.div`
  width: fit-content;
  margin-right: 10px;

  text-align: center;
`

const Header = () => {
  return (
    <HeaderBase>
      <Logo src={OpusLogo}></Logo>
      <UserInfo>
        <a style={{fontSize: '10px'}}>Logged in:</a><br />
        <b style={{color: 'var(--highlight-color)'}}>System</b>
      </UserInfo>
    </HeaderBase>
  )
}

export default Header