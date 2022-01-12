
import React, { useState } from "react"
import styled from "styled-components"
import { useSelector, useDispatch } from "react-redux"
import { sendResetEmail } from '../../actions/authActions'

const GridBaseDiv = styled.form`
  display: grid;

  grid-template-columns: 1fr 1fr 2fr;
  grid-template-rows: 0.8fr 1fr 1fr;
  grid-template-areas:
  "  Header    Header     Header  "
  " EmailLbl EmailField EmailField"
  "    .          .      SubmitBtn";

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

  ${({ disabled }) => disabled && `
    background-color: white;
    color: black;
    border-color: black;
  `}

	&:hover {
		background-color: ${props => props.color || "black"};
		color: white;
    
    ${({ disabled }) => disabled && `
      background-color: white;
      color: black;
      border-color: black;
    `}
	}
`

const MessageDiv = styled.div`
  background-color: var(--bg-gray);
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;

  white-space: pre-wrap;
`

const ResetPassword = (props) => {
  const [email, setEmail] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)

  const dispatch = useDispatch()
  const resetPwErrorState = useSelector((state) => state.errors.reset_pw)

  const submitAction = (e) => {
    e.preventDefault();
    setShowSuccessMessage(false)
    setSubmitBtnDisabled(true)

    dispatch(sendResetEmail(
      email, 
      () => {
        setShowSuccessMessage(true)
        setSubmitBtnDisabled(false)
      },
      () => {
        setSubmitBtnDisabled(false)
      }
    ))
  }

  return (
    <React.Fragment>
      <GridBaseDiv onSubmit={submitAction}>
      <a style={{gridArea:'Header', textAlign:'center'}}>Reset Password</a>
        <FormLabel gridArea='EmailLbl'>Email</FormLabel>
        <input 
          className="text_input"
          style={{gridArea:'EmailField'}}
          value={email}
          onChange={(e)=>{setEmail(e.target.value.trim())}}
          placeholder="example@eg.com"
          autoComplete="email"
        />
        <ModalBtn 
          type='submit'
          disabled={submitBtnDisabled}
          value='Reset Password'
          style={{gridArea:'SubmitBtn', marginTop:'5px'}}
          color='var(--highlight-color)'
        />
      </GridBaseDiv>
      { resetPwErrorState !== null &&
        <MessageDiv>
          <a style={{color:'var(--dark-red)'}}>Error: </a>{resetPwErrorState.message}
        </MessageDiv>
      }
      { showSuccessMessage && 
        <MessageDiv>
          <a style={{color:'var(--highlight-color)'}}>Check your Email for the email reset link!</a>
        </MessageDiv>
      }
    </React.Fragment>
  )
}

export default ResetPassword