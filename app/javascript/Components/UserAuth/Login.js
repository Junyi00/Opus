
import React, { useState } from "react"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import { loginUser } from "../../actions/authActions"

import ResetPasswordModal from "./Modals/ResetPasswordModal"

const GridBaseDiv = styled.form`
  display: grid;

  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
  " UserLbl  UserField UserField"
  " PassLbl  PassField PassField"
  "ForgetBtn ForgetBtn LoginBtn ";

  gap: 5px 10px;
`

const FormLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: right;

  grid-area: ${props => props.gridArea};
`

const ModalBtn = styled.input`
	background-color: transparent;
	border: 1px solid ${props => props.color || "black"};;
	border-radius: 5px;
	color: ${props => props.color || "black"};

	padding: 2px 5px 2px 5px;

	&:hover {
		background-color: ${props => props.color || "black"};
		color: white;
	}
`

const MessageDiv = styled.div`
  background-color: var(--bg-gray);
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;

  white-space: pre-wrap;
`

const ForgetBtn = styled.button`
  height: fit-content;
  width: fit-content;

  border: none;
  text-align: left;
  font-size: 12px;
  color: var(--highlight-color);

  &:hover {
    text-decoration: underline; 
  }
`

const Login = (props) => {
  const [userValue, setUserValue] = useState('')
  const [passValue, setPassValue] = useState('')
  const [showResetModal, setShowResetModal] = useState(false)

  const dispatch = useDispatch()

  const loginAction = (data) => {
    dispatch(loginUser(data, ()=>{}))
  }

  const submitAction = (e) => {
    e.preventDefault();
    loginAction({
      username: userValue,
      password: passValue,
    })
  }

  const forgetPasswordAction = (e) => {
    e.preventDefault()
    setShowResetModal(true)
  }

  return (
    <React.Fragment>
      <GridBaseDiv onSubmit={submitAction}>
        <FormLabel gridArea='UserLbl'>User</FormLabel>
        <input 
          className="text_input"
          style={{gridArea:'UserField'}}
          value={userValue.trim()}
          onChange={(e)=>{setUserValue(e.target.value)}}
          placeholder="GiveMyHeart"
          autoComplete="username"
        />
        <FormLabel gridArea='PassLbl'>Password</FormLabel>
        <input 
          className="text_input"
          style={{gridArea:'PassField'}} 
          type="password"
          value={passValue}
          onChange={(e)=>{setPassValue(e.target.value)}}
          placeholder="ToSomeoneSpecial"
          autoComplete="current-password"
        />
        <ModalBtn 
          type='submit'
          value='Login'
          style={{gridArea:'LoginBtn', marginTop:'5px'}}
          color='var(--highlight-color)'
        />
        <div style={{gridArea:'ForgetBtn', display:'flex', alignItems:'end'}}>
          <ForgetBtn 
            onClick={forgetPasswordAction}>Forget Password?
          </ForgetBtn>
        </div>
        
      </GridBaseDiv>
      {
        props.loginErrorState !== null && <MessageDiv>
          <a style={{color:'var(--dark-red)'}}>Error: </a>{props.loginErrorState.message}
        </MessageDiv>
      }
      { showResetModal && <ResetPasswordModal showModal={showResetModal} setShowModal={setShowResetModal}/> }
    </React.Fragment>
  )
}

export default Login