import React from 'react'
import { Dialog } from '@headlessui/react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'

import { clearErrors } from '../../actions/authActions'

const BaseDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  width: fit-content;
  maxHeight: 95vh; // prevent from exceeding the height of the screen

  background-color: white;

  position: relative;
`

const ErrorModal = (props) => {
  const showModal = props.showModal
  const setShowModal = props.setShowModal

  const dispatch = useDispatch()
  const appErrorState = useSelector((state) => state.errors.app)

  const closeAction = () => {
    if (!appErrorState.critical) {
      dispatch(clearErrors()).then(resp => {
        setShowModal(false)
      })
    }
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
          <b style={{fontSize:'3vw'}}>Error Occured</b><br />

          { appErrorState !== null &&
            <React.Fragment>
              <a style={{color:'var(--dark-red)'}}>Message: </a>{ appErrorState.message }
              {
                appErrorState.critical
                  ? <a>Please Refresh the page!</a>
                  : <a>Please try again!</a>
              }
              <br />

              <a style={{border:'1px solid var(--light-gray)', padding:'5px', width:'100%'}}>
                {appErrorState.data}
              </a>
            </React.Fragment>
          }
        </BaseDiv>
      </div>
    </Dialog>
  )
}

export default ErrorModal