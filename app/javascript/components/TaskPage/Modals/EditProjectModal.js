import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { updateProject, deleteProject } from '../../../actions/projectsActions';

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

const EditProjectModal = ({
	showModal, setShowModal, projectsState, updateProject, deleteProject
}) => {
	const [projNameValue, setProjNameValue] = useState('')
	const [showWarning, setShowWarning] = useState(false)

	const projName = projectsState.selectedIndex !== null ? projectsState.projects[projectsState.selectedIndex].name : "~UNKNOWN~"		

	const submitAction = () => {
			const trimmedProjName = projNameValue.trim()
			if (trimmedProjName !== '' && trimmedProjName !== projName) {
				updateProject(projectsState.projects[projectsState.selectedIndex].id, { 
					name: trimmedProjName 
				})
			}

			requestClose()
	}

	const deleteAction = () => {
		if (!showWarning) {
			setShowWarning(true)
		}
		else {
			deleteProject(projectsState.projects[projectsState.selectedIndex].id)
			requestClose()
		}	
	}

	const requestClose = () => {
		// Reset
		setShowWarning(false)
		setProjNameValue("")

		setShowModal(false)
	}

	return (
		<Dialog 
			open={showModal}
			onClose={requestClose}
			as="div"
			className="fixed inset-0 z-10 overflow-y-auto"
		>

			<div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 z-5 bg-black bg-opacity-25" />

				<div className="flex flex-col row-gap-2 items-center justfiy-center bg-white p-5 border-gray-50 rounded-2xl z-10">
					<Dialog.Title>Project Title</Dialog.Title>
					<input 
						className='text_input'
						style={{textAlign: 'center'}}
						value={projNameValue} 
						onKeyUp={(e) => {e.key == "Enter" ? submitAction() : null}}
						onChange={(e)=>{setProjNameValue(e.target.value)}} 
						type='text'
						placeholder={projName}
						autoFocus
					/>
					<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: '5px'}}>
						<ModalBtn type='text' color='var(--dark-red)' onClick={deleteAction}>Delete</ModalBtn>
						<ModalBtn type='text' color='var(--highlight-color)' onClick={submitAction}>Save</ModalBtn>
					</div>
					{
						!showWarning ? null :
							<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
								<hr style={{height: '1px', width: '100%', margin: '5px'}}></hr>
								<a>Are you sure you want to delete the project?</a><br />
								<a>Click the button again to confirm</a>
							</div>
					}
				</div>
			</div>

		</Dialog>
  );

}

export default connect(
	(state) => ({
		projectsState: state.projects
	}),
	(dispatch) => ({
		updateProject: (...args) => dispatch(updateProject(...args)),
		deleteProject: (...args) => dispatch(deleteProject(...args))
	})
)(EditProjectModal)