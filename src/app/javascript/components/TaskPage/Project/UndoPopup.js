import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { undoLastAction, hideUndoAlert } from "../../../actions/undoActions"

const UndoAlert = styled.button`
  position: fixed;
  bottom: 15px;
  left: 50%;
  translate: transform(-50%, 0%); 
`

const MAX_DISPLAY_TIME_MILIS = 10000; // 10 seconds

const UndoPopup = ({
  showAlert,
  undoLastAction,
  hideUndoAlert
}) => {
  const [displayTimeMilis, setDisplayTimeMilis] = useState(0)

  useEffect(() => {
    if (showAlert == null) { return } // do not start interval if alert is not display
    const interval = setInterval(() => {
      setDisplayTimeMilis(Date.now() - showAlert)
    }, 500)
    
    return () => clearInterval(interval)
  }, [showAlert])

  useEffect(() => {
    if (displayTimeMilis > MAX_DISPLAY_TIME_MILIS) { 
      hideUndoAlert()  
    }
  }, [displayTimeMilis])

  return (
    showAlert == null || displayTimeMilis > MAX_DISPLAY_TIME_MILIS ? null : 
    <UndoAlert
      className="popup_button"
      onClick={() => {
        undoLastAction()
        hideUndoAlert()
      }}
    >
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', columnGap:'10px'}}>
        <a>Click to Undo!</a>
        <a style={{color:'darkgray'}}>{Math.ceil((MAX_DISPLAY_TIME_MILIS - displayTimeMilis)/1000)}</a>
      </div>  
    </UndoAlert>
  )

}

export default connect(
  (state) => ({
    showAlert: state.projectLayout.show_alert
  }),
  (dispatch) => ({
    undoLastAction: () => dispatch(undoLastAction()),
    hideUndoAlert: () => dispatch(hideUndoAlert())
  })
)(UndoPopup)