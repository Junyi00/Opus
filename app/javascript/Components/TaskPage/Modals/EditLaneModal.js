import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { updateLane, deleteLane } from '../../../actions/projectLayoutActions';

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

const EditLaneModal = (props) => {
	const [laneNameValue, setLaneNameValue] = useState('')
	const [showWarning, setShowWarning] = useState(false)

	const showModal = props.showModal
	const setShowModal = props.setShowModal
	const laneName = props.laneName
	const laneId = props.laneId

	const dispatch = useDispatch()

	const submitAction = () => {
			const trimmedLaneName = laneNameValue.trim()
			if (trimmedLaneName !== '' && trimmedLaneName !== laneName)

			dispatch(updateLane(laneId, {
				name: trimmedLaneName
			}))
			requestClose()
	}

	const deleteAction = () => {
		if (!showWarning) {
			setShowWarning(true)
		}
		else {
			dispatch(deleteLane(laneId))
			
			requestClose()
		}	
	}

	const requestClose = () => {
		// Reset
		setShowWarning(false)
		setLaneNameValue("")

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
					<Dialog.Title>Lane Title</Dialog.Title>
					<input 
						className='text_input'
						style={{textAlign: 'center'}}
						value={laneNameValue} 
						onKeyUp={(e) => {e.key == "Enter" ? submitAction() : null}}
						onChange={(e)=>{setLaneNameValue(e.target.value)}} 
						type='text'
						placeholder={laneName}
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
								<a>Are you sure you want to delete this lane? All tasks will be deleted too</a><br />
								<a>Click the button again to confirm</a>
							</div>
					}
				</div>
			</div>	

		</Dialog>
  );

}

export default EditLaneModal