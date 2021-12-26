import React from "react";
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import OpusLogo from 'images/Opus_Logo.png'

const HeaderBase = styled.header`
  background-color: #fcfcfc;
  // border-bottom: 1px solid var(--light-gray);
  box-shadow: rgba(100, 100, 111, 0.1) var(--sidebar-width) 7px 29px 0px;
  // padding: 5px;
  opacity: 95%;

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
  z-index: 2; // prevent sidebar's shadow from laying above the header
`

const Logo = styled.img`
  height: 100%; // take full height of container div
  padding: 5px;
`

const UserInfo = styled.div`
  width: fit-content;
  margin-right: 10px;

  text-align: center;
`

const SearchBar = styled.input`
  width: 100%;
  height: 100%;
  border-radius: var(--standard-br);

  padding-left: 5px;
`

const SearchCancelBtn = styled.button`
  position: absolute;
  right: 10px; // manual 10px margin-right
  width: fit-content;
  height: fit-content;
  padding: 0px 6px 0px 6px;

  top: 50%;
  transform: translate(0%, -50%);

  color: var(--dark-red);
  
  font-family: cursive; // Nice simple X
`

const Header = (props) => {
  const searchQuery = props.searchQuery
  const setSearchQuery = props.setSearchQuery

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  const username = useSelector((state) => state.user.username)

  return (
    <HeaderBase>
      <div style={{height:'100%'}}>
        <Logo src={OpusLogo}></Logo>
      </div>
      
      {
        (props.projectLoaded === null) ? null :
          <div style={{float: 'left', height: '70%', width: '30%', position: 'relative'}}>
            <SearchBar 
              value={searchQuery.trim()}
              onChange={(e)=>{setSearchQuery(e.target.value)}}
              placeholder="Search..."
            />
            <SearchCancelBtn onClick={()=>setSearchQuery('')} style={{display: (searchQuery  == '' ? 'none' : 'block')}}>X</SearchCancelBtn>
          </div>
          
      }
      { isLoggedIn && 
        <UserInfo>
          <a style={{fontSize: '10px'}}>Logged in:</a><br />
          <b style={{color: 'var(--highlight-color)'}}>{username}</b>
        </UserInfo>
      }
    </HeaderBase>
  )
}

export default Header