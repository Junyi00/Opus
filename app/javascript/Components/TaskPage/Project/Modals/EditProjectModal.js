import { Dialog } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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

const EditProjectModal = (props) => {
	const [projNameValue, setProjNameValue] = useState('')
	const [showWarning, setShowWarning] = useState(false)

	let projName = props.selectedIndex >= 0 ? props.projects[props.selectedIndex].name : '~Unknown~'
	const showModal = props.showModal
	const setShowModal = props.setShowModal
	const setModalRes = props.setModalRes

	// Update Modal when a new project is selected
	useEffect(()=> {
		projName = props.selectedIndex >= 0 ? props.projects[props.selectedIndex].name : '~Unknown~'
	}, [props.selectedIndex])

	const submitAction = () => {
			const trimmedProjName = projNameValue.trim()
			if (trimmedProjName !== '' && trimmedProjName !== projName)
			setModalRes({
				projId: props.projects[props.selectedIndex].id,
				toDelete: false, 
				newName: trimmedProjName
			});
			requestClose()
	}

	const deleteAction = () => {
		if (!showWarning) {
			setShowWarning(true)
		}
		else {
			setModalRes({
				projId: props.projects[props.selectedIndex].id,
				toDelete: true, 
			});
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
			className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
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

export default EditProjectModal