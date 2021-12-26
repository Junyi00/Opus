
import React, { useState } from "react"
import styled from "styled-components"

const GridBaseDiv = styled.form`
  display: grid;

  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
  "UserLbl UserField UserField"
  "PassLbl PassField PassField"
  "   .        .     LoginBtn ";

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
`

const Login = (props) => {
  const [userValue, setUserValue] = useState('')
  const [passValue, setPassValue] = useState('')

  const loginOnClick = props.loginOnClick

  const submitAction = (e) => {
    e.preventDefault();
    loginOnClick({
      username: userValue,
      password: passValue,
    })
  }

  return (
    <React.Fragment>
      <GridBaseDiv onSubmit={submitAction}>
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
        <ModalBtn 
          type='submit'
          value='Login'
          style={{gridArea:'LoginBtn', marginTop:'5px'}}
          color='var(--highlight-color)'
          onClick={submitAction}
        />
      </GridBaseDiv>
      {
        Object.keys(props.errorState).length !== 0 && props.errorState.request_type == "loginUser" && <MessageDiv>
          {props.errorState.error}
        </MessageDiv>
      }
    </React.Fragment>
  )
}

export default Login