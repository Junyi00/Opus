
import React, { useState } from "react"
import styled from "styled-components"
import { connect } from "react-redux"

import { addUser } from "../../actions/authActions"

const GridBaseDiv = styled.form`
  display: grid;

  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-areas:
  "EmailLbl     EmailField    EmailField  "
  "UserLbl       UserField     UserField  "
  "PassLbl       PassField     PassField  "
  "PassConfLbl PassConfField PassConfField"
  "   .              .         SignupBtn  ";

  gap: 5px 10px;
`

const FormLabel = styled.label`
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

  white-space: pre-wrap
`

const Signup = ({
  signupErrorState, addUser
}) => {
  const [emailValue, setEmailValue] = useState('')
  const [userValue, setUserValue] = useState('')
  const [passValue, setPassValue] = useState('')
  const [passConfValue, setPassConfValue] = useState('')

  const [signUpSuccess, setSignUpSuccess] = useState(false)

  const signupAction = (data) => {
    addUser(data, ()=>{
      setSignUpSuccess(true)
    })
  }

  const submitAction = (e) => {
    e.preventDefault();
    const user = {
      email: emailValue,
      username: userValue,
      password: passValue,
      password_confirmation: passConfValue,
    };
    signupAction(user);
  }

  return (
    <React.Fragment>
      <GridBaseDiv onSubmit={submitAction}>
        <FormLabel htmlFor='EmailField' gridArea='EmailLbl'>Email</FormLabel>
        <input 
          id='EmailField'
          className="text_input"
          aria-label="Email"
          aria-required="true"  
          style={{gridArea:'EmailField'}} 
          value={emailValue}
          onChange={(e)=>{setEmailValue(e.target.value)}}
          placeholder="LastChristmas@santa.org"
          autoComplete="email"
        />
        <FormLabel htmlFor='UserField' gridArea='UserLbl'>User</FormLabel>
        <input 
          id='UserField'
          className="text_input"
          aria-label="Username"
          aria-required="true"  
          style={{gridArea:'UserField'}} 
          value={userValue.trim()}
          onChange={(e)=>{setUserValue(e.target.value)}}
          placeholder="GiveMyHeart"
          autoComplete="username"
        />
        <FormLabel htmlFor='PassField' gridArea='PassLbl'>Password</FormLabel>
        <input 
          id='PassField'
          className="text_input"
          aria-label="Password"
          aria-required="true"  
          style={{gridArea:'PassField'}} 
          type="password"
          value={passValue}
          onChange={(e)=>{setPassValue(e.target.value)}}
          placeholder="ToSomeoneSpecial"
          autoComplete="new-password"
        />
        <FormLabel htmlFor='PassConfField' gridArea='PassConfLbl' style={{visibility:'hidden'}}/>
        <input 
          id='PassConfField'
          className="text_input"
          aria-label="Password Confirmation"
          aria-required="true"  
          style={{gridArea:'PassConfField'}} 
          type="password"
          value={passConfValue}
          onChange={(e)=>{setPassConfValue(e.target.value)}}
          placeholder="Another time..."
          autoComplete="off"
        />
        <ModalBtn 
          type='submit'
          value='Sign Up!'
          style={{gridArea:'SignupBtn', marginTop:'5px'}}
          color='var(--highlight-color)'
        />
      </GridBaseDiv>
      {
        signUpSuccess && <MessageDiv>User Created!</MessageDiv>
      }
      {
        signupErrorState !== null && <MessageDiv>
          <a style={{color:'var(--dark-red)'}}>Error: </a>{signupErrorState.message}
        </MessageDiv>
      }
    </React.Fragment>
  )
}

export default connect(
  (state) => ({
    signupErrorState: state.errors.signup
  }),
  (dispatch) => ({
    addUser: (...args) => dispatch(addUser(...args))
  })
)(Signup)