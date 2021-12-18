import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const customStyle = {
    content: {
        width: 'fit-content',
        height: 'fit-content',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    }
}

const BaseForm = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 5px;
`

const SaveBtn = styled.button`
    background-color: transparent;
    border: 1px solid var(--highlight-color);
    border-radius: 5px;
    color: var(--highlight-color);

    padding: 2px;
    margin-top: 5px;
`

const DeleteBtn = styled.button`
    background-color: transparent;
    border: 1px solid var(--dark-red);
    border-radius: 5px;
    color: var(--dark-red);

    padding: 2px;
    margin-top: 5px;
`

const EditProjectModal = (props) => {
    const [showModal, setShowModal] = useState(true)
    const [projNameValue, setProjNameValue] = useState('')
    const [showWarning, setShowWarning] = useState(false)

    const projName = props.projName

    const submit = () => {
        // `onClose` is added by 'PopupManager' to props
        props.onClose(false, projNameValue);
        requestClose(false)
    }

    const requestClose = () => {
        setShowModal(false)
    }

    const deleteProject = () => {
        if (showWarning) {
            props.onClose(true, null)
            setShowModal(false)
        }
        else {
            setShowWarning(true)
        }
    }

return (
        <Modal style={customStyle} isOpen={showModal} onRequestClose={requestClose} shouldCloseOnOverlayClick={true}>
            <BaseForm>
                <a style={{marginBottom: '2px'}}>Project Title</a>
                <input 
                    value={projNameValue.trim()} 
                    onChange={(e)=>{setProjNameValue(e.target.value)}} 
                    type='text'
                    placeholder={projName}
                    autoFocus
                />
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: '5px'}}>
                    <SaveBtn type='text' onClick={submit}>Save</SaveBtn>
                    <DeleteBtn type='text' onClick={deleteProject}>Delete</DeleteBtn>
                </div>
                {
                    !showWarning ? null :
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <hr style={{height: '1px', width: '100%', margin: '5px'}}></hr>
                            <a>Are you sure you want to delete the project?</a><br />
                            <a>Click the button again to confirm</a>
                        </div>
                }
                
            </BaseForm>
        </Modal>
    );

}

export default EditProjectModal