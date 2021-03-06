import React, { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { updatePassword } from '../../../actions/authActions'

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
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-template-areas:
    "cPassLbl  cPassField "
    "nPassLbl  nPassField "
    "   .     cnPassField "
    " Footer     Footer   ";

  gap: 10px 5px;

  margin-top: 10px;
  margin-bottom: 10px;
`

const FormLabel = styled.label`
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

const UpdatePasswordModal = ({
  showModal, setShowModal, updatePwErrorState, updatePassword
}) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  let initialFocusRef = useRef(null)

  const closeAction = () => {
    setShowModal(false)

    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
    setShowSuccessMessage(false)
  }

  const submitAction = (e) => {
    e.preventDefault();
    setShowSuccessMessage(false)

    const user = {
      password: newPassword,
      password_confirmation: confirmNewPassword,
    };
    updatePassword(user, currentPassword, () => setShowSuccessMessage(true))
  }

  return (
    <Dialog
      initialFocus={initialFocusRef}
      open={showModal}
      onClose={closeAction}
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 z-5 bg-black bg-opacity-25" />
          
        <BaseDiv ref={initialFocusRef} className='rounded-2xl p-5 z-10'>
          <Dialog.Title>Reset Password</Dialog.Title>

          <GridContainer onSubmit={submitAction}>
            <FormLabel htmlFor='cPassField' gridArea='cPassLbl'>Current Password</FormLabel>
            <input 
              id='cPassField'
              className="text_input"
              aria-label="Current Password"
              aria-required="true"
              style={{gridArea:'cPassField'}}
              type="password"
              value={currentPassword}
              onChange={(e)=>{setCurrentPassword(e.target.value)}}
              placeholder=""
              autoComplete="current-password"
              autoFocus
            />
            <FormLabel htmlFor='nPassField' gridArea='nPassLbl'>New Password</FormLabel>
            <input 
              id='nPassField'
              className="text_input"
              aria-label="New Password"
              aria-required="true"
              style={{gridArea:'nPassField'}} 
              type="password"
              value={newPassword}
              onChange={(e)=>{setNewPassword(e.target.value)}}
              placeholder=""
              autoComplete="off"
            />
            <FormLabel htmlFor='cnPassField' style={{visibility:'hidden'}} />
            <input 
              id='cnPassField'
              className="text_input"
              aria-label="Password Confirmation"
              aria-required="true"
              style={{gridArea:'cnPassField'}} 
              type="password"
              value={confirmNewPassword}
              onChange={(e)=>{setConfirmNewPassword(e.target.value)}}
              placeholder="Again..."
              autoComplete="off"
            />
            <div style={{gridArea:'Footer', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: '5px'}}>
              <ModalBtn type='submit' color='var(--highlight-color)'>Reset</ModalBtn>
            </div>
          </GridContainer>
          { updatePwErrorState !== null &&
            <MessageDiv>
              <a style={{color:'var(--dark-red)'}}>Error: </a>{updatePwErrorState.message}
            </MessageDiv>
          }
          { showSuccessMessage && 
            <MessageDiv>
              <a style={{color:'var(--highlight-color)'}}>Success!</a>
            </MessageDiv>
          }
        </BaseDiv>
      </div>
    </Dialog>
  )
}

export default connect(
  (state) => ({
    updatePwErrorState: state.errors.update_pw,
  }),
  (dispatch) => ({
    updatePassword: (...args) => dispatch(updatePassword(...args))
  })
)(UpdatePasswordModal)