import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components'
import { connect } from 'react-redux'
import { logoutUser } from '../actions/authActions'
import OpusLogo from 'images/Opus_Logo.png'

import { Menu } from '@headlessui/react'
import UpdatePasswordModal from "./TaskPage/Modals/UpdatePasswordModal";

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
  padding: 5px;
  border-radius: var(--standard-br);

  text-align: center;

  &:hover {
    background-color: var(--bg-gray);
  }
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

const UserMenuStyle = {
  position: 'fixed',
  top: 'var(--header-height)',
  right: '0px',

  display: 'flex',
  flexDirection: 'column',
  alignitems: 'end',
  rowGap: '5px', 

  // backgroundColor: 'var(--bg-gray)',
  padding: '5px'
}

const MenuItemBtn = styled.button``

const Header = ({
  searchQuery, setSearchQuery, userState, selectedIndex, logoutUser
}) => {
  const [showResetPassModal, setShowResetPassModal] = useState(false)

  const logoutAction = () => {
    logoutUser({
      user_id: userState.id
    })
  }

  const updatePasswordAction = () => {
    setShowResetPassModal(true)
  }

  return (
    <React.Fragment>
      <HeaderBase>
        <div style={{height:'100%'}}>
          <Link to='/'><Logo draggable="false" src={OpusLogo} /></Link>
        </div>
        
        {
          (selectedIndex === null) ? null :
            <div style={{float: 'left', height: '70%', width: '40%', position: 'relative'}}>
              <SearchBar 
                value={searchQuery.trim()}
                onChange={(e)=>{setSearchQuery(e.target.value)}}
                placeholder="Search task names / #tags"
              />
              <SearchCancelBtn onClick={()=>setSearchQuery('')} style={{display: (searchQuery  == '' ? 'none' : 'block')}}>X</SearchCancelBtn>
            </div>
            
        }
        { userState.isLoggedIn && 
          <Menu>
            <Menu.Button>
              <UserInfo>
                <a style={{fontSize: '10px'}}>Logged in:</a><br />
                <b style={{color: 'var(--highlight-color)'}}>{userState.username}</b>
              </UserInfo>
            </Menu.Button>
            <Menu.Items
              style={UserMenuStyle}
            >
              <Menu.Item>
                <MenuItemBtn className="popup_button" onClick={updatePasswordAction}>Reset Password</MenuItemBtn>
              </Menu.Item>
              <Menu.Item>
                <MenuItemBtn className="popup_button" onClick={logoutAction}>Logout</MenuItemBtn>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        }
      </HeaderBase>
      <UpdatePasswordModal showModal={showResetPassModal} setShowModal={setShowResetPassModal}/>
    </React.Fragment>
  )
}

export default connect(
  (state) => ({
    userState: state.user,
    selectedIndex: state.projects.selectedIndex
  }),
  (dispatch) => ({
    logoutUser: (...args) => dispatch(logoutUser(...args))
  })
)(Header)