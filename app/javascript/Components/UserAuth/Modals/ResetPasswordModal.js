import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { sendResetEmail } from '../../../actions/authActions'

import { Dialog } from '@headlessui/react'

const BaseDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  width: fit-content;
  maxHeight: 95vh; // prevent from exceeding the height of the screen

  background-color: white;

  position: relative;
`

const GridContainer = styled.form`
  display: grid;

  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr;
  grid-template-areas:
    "emailLbl  emailField "

  gap: 10px 5px;

  margin-top: 10px;
  margin-bottom: 10px;
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

  white-space: pre-wrap;
`

/*
NOT IN USE
ResetPassword tab in the page is used instead (for aesthetics reasons)
*/

const ResetPasswordModal = (props) => {
  const showModal = props.showModal
  const setShowModal = props.setShowModal

  const [email, setEmail] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const dispatch = useDispatch()
  const resetPwErrorState = useSelector((state) => state.errors.reset_pw)

  const closeAction = () => {
    setShowModal(false)
  }

  const submitAction = (e) => {
    e.preventDefault();
    setShowSuccessMessage(false)

    dispatch(sendResetEmail(email, () => setShowSuccessMessage(true)))
  }

  return (
    <Dialog
      open={showModal}
      onClose={closeAction}
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 z-5 bg-black bg-opacity-25" />
          
        <BaseDiv className='rounded-2xl p-5 z-10'>
          <Dialog.Title>Reset Password</Dialog.Title>

          <GridContainer onSubmit={submitAction}>
            <FormLabel gridArea='emailLbl'>setEmail</FormLabel>
            <input 
              className="text_input"
              style={{gridArea:'emailField'}}
              value={email}
              onChange={(e)=>{setEmail(e.target.value.trim())}}
              placeholder="example@eg.com"
              autoComplete="email"
            />
          </GridContainer>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: '5px'}}>
						<ModalBtn type='text' color='var(--highlight-color)' onClick={submitAction}>Reset Email</ModalBtn>
					</div>
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
        </BaseDiv>
      </div>
    </Dialog>
  )
}

export default ResetPasswordModal