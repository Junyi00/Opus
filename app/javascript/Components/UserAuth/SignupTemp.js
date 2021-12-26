
import React, { useState } from "react"
import styled from "styled-components"

const GridBaseDiv = styled.div`
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

const ModalBtn = styled.button`
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
`

const SignupTemp = (props) => {
  const [emailValue, setEmailValue] = useState('')
  const [userValue, setUserValue] = useState('')
  const [passValue, setPassValue] = useState('')
  const [passConfValue, setPassConfValue] = useState('')

  const signupOnClick = props.signupOnClick

  const submitAction = () => {
    const user = {
      email: emailValue,
      username: userValue,
      password: passValue,
      password_confirmation: passConfValue,
    };
    signupOnClick(user);
  }

  return (
    <React.Fragment>
      <GridBaseDiv>
        <FormLabel gridArea='EmailLbl'>Email</FormLabel>
        <input 
          style={{gridArea:'EmailField'}} 
          value={emailValue}
          onChange={(e)=>{setEmailValue(e.target.value)}}
          placeholder="LastChristmas@santa.org"
        />
        <FormLabel gridArea='UserLbl'>User</FormLabel>
        <input 
          style={{gridArea:'UserField'}} 
          value={userValue}
          onChange={(e)=>{setUserValue(e.target.value)}}
          placeholder="GiveMyHeart"
        />
        <FormLabel gridArea='PassLbl'>Password</FormLabel>
        <input 
          style={{gridArea:'PassField'}} 
          type="password"
          value={passValue}
          onChange={(e)=>{setPassValue(e.target.value)}}
          placeholder="ToSomeoneSpecial"
        />
        <input 
          style={{gridArea:'PassConfField'}} 
          type="password"
          value={passConfValue}
          onChange={(e)=>{setPassConfValue(e.target.value)}}
          placeholder="Another time..."
        />
        <ModalBtn 
          style={{gridArea:'SignupBtn', marginTop:'5px'}}
          color='var(--highlight-color)'
          onClick={submitAction}
        >Sign Up!</ModalBtn>
      </GridBaseDiv>
      {
        props.successState && <MessageDiv>User Created!</MessageDiv>
      }
      {
        Object.keys(props.errorState).length !== 0 && props.errorState.request_type == "addUser" && <MessageDiv>
          {props.errorState.error}
        </MessageDiv>
      }
    </React.Fragment>
  )
}

export default SignupTemp