
import React, { useState } from "react"
import styled from "styled-components"
import { useDispatch } from "react-redux"

import { addUser } from "../../actions/authActions"

const GridBaseDiv = styled.form`
  display: grid;

  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-areas:
  "EmailLbl   EmailField   EmailField  "
  "UserLbl    UserField     UserField  "
  "PassLbl    PassField     PassField  "
  "   .     PassConfField PassConfField"
  "   .           .         SignupBtn  ";

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

  white-space: pre-wrap
`

const Signup = (props) => {
  const [emailValue, setEmailValue] = useState('')
  const [userValue, setUserValue] = useState('')
  const [passValue, setPassValue] = useState('')
  const [passConfValue, setPassConfValue] = useState('')

  const [signUpSuccess, setSignUpSuccess] = useState(false)

  const dispatch = useDispatch()

  const signupAction = (data) => {
    dispatch(addUser(data, ()=>{
      setSignUpSuccess(true)
    }))
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
        <FormLabel gridArea='EmailLbl'>Email</FormLabel>
        <input 
          className="text_input"
          style={{gridArea:'EmailField'}} 
          value={emailValue}
          onChange={(e)=>{setEmailValue(e.target.value)}}
          placeholder="LastChristmas@santa.org"
          autoComplete="email"
        />
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
          autoComplete="new-password"
        />
        <input 
          className="text_input"
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
        props.signupErrorState !== null && <MessageDiv>
          <a style={{color:'var(--dark-red)'}}>Error: </a>{props.signupErrorState.message}
        </MessageDiv>
      }
    </React.Fragment>
  )
}

export default Signup