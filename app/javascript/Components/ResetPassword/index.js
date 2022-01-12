import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { forgetResetPassword } from "../../actions/authActions";
import OpusIcon from 'images/Opus_Icon.png'

import Header from "../Header";

const BaseDiv = styled.div`
  position: absolute;
  top: var(--header-height);
  bottom: 0px;
  left: 0px;
  right: 0px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden; // prevent scrolling due to large bg img size
`

const ContentDiv = styled.div`
  max-width: 80%;
  width: fit-content;
  height: fit-content;
  padding: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  
  box-shadow: rgba(100, 100, 111, 0.1) 0px 0px 29px 0px;
  background-color: white;
  border: 1px solid var(--light-gray); 
  border-radius: 10px;
  
  opacity: 90%;
`

const GridFormDiv = styled.form`
  display: grid;

  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "passLbl  passField "
    // "cPassLbl cPassField"
    " Footer    Footer  ";

  gap: 10px 5px;

  margin-top: 10px;
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

const FormLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: right;

  grid-area: ${props => props.gridArea};
`

const MessageDiv = styled.div`
  background-color: var(--bg-gray);
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;

  white-space: pre-wrap;
`

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [searchParams, _] = useSearchParams();

  const dispatch = useDispatch();
  const resetPwErrorState = useSelector((state) => state.errors.reset_pw)

  const submitAction = (e) => {
    e.preventDefault()
    dispatch(forgetResetPassword(
      searchParams.get('token'), 
      { password: newPassword },
      () => { setShowSuccessMessage(true) }
    ))
  }

  return (
    <React.Fragment>
      <Header 
        projectLoaded={null}
        searchQuery=''
      />
      <BaseDiv>
        <img style={{position:'absolute', opacity:'10%', width:'80%', zIndex:'-1'}} src={OpusIcon} />
        <ContentDiv>
          <b>Reset Password</b>
          { searchParams.get('token') !== null ?  // TODO: CHECK FOR TOKEN VALIDITY
            <React.Fragment>
              <GridFormDiv onSubmit={submitAction}>
                <FormLabel gridArea='passLbl'>New Password</FormLabel>
                <input 
                  className="text_input"
                  style={{gridArea:'passField'}} 
                  type="password"
                  value={newPassword}
                  onChange={(e)=>{setNewPassword(e.target.value)}}
                  placeholder=""
                  autoComplete="off"
                />
                <div style={{gridArea:'Footer', display:'flex', flexDirection:'column', alignItems:'center'}}>
                  <ModalBtn color='var(--highlight-color)' onClick={submitAction}>Reset!</ModalBtn>
                </div>
              </GridFormDiv>
              { resetPwErrorState !== null &&
                <MessageDiv>
                  <a style={{color:'var(--dark-red)'}}>Error: </a>{resetPwErrorState.message}
                </MessageDiv>
              }
              { showSuccessMessage && <MessageDiv>
                  <a style={{color:'var(--highlight-color)'}}>Password Successfully Resetted!</a><br />
                  <Link style={{marginTop: '10px', textAlign:'center', color:'var(--highlight-color)', textDecoration:'underline'}} to="/">
                    Return to Home Page!
                  </Link>
                </MessageDiv>
              }
            </React.Fragment>
            :
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
              <a>Invalid Token!</a>
              <Link style={{marginTop: '10px', textAlign:'center', color:'var(--highlight-color)'}} to="/">
                Click here <br /> 
                to return to the home page!
              </Link>
            </div>
          }
        </ContentDiv>
      </BaseDiv>
    </React.Fragment>
  )
}

export default ResetPassword