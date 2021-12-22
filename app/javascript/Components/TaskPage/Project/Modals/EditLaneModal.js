import { Dialog } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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

const EditLaneModal = (props) => {
	const [laneNameValue, setLaneNameValue] = useState('')
	const [showWarning, setShowWarning] = useState(false)

	const showModal = props.showModal
	const setShowModal = props.setShowModal
	const setModalRes = props.setModalRes
	const laneName = props.laneName
	const laneId = props.laneId

	const submit = () => {
			const trimmedLaneName = laneNameValue.trim()
			if (trimmedLaneName !== '' && trimmedLaneName !== laneName)
			setModalRes({
				laneId: laneId,
				toDelete: false, 
				newName: trimmedLaneName
			});
			requestClose()
	}

	const requestClose = () => {
		// Reset
		setShowWarning(false)
		setLaneNameValue("")

		setShowModal(false)
	}

	const deleteLane = () => {
		if (!showWarning) {
			setShowWarning(true)
		}
		else {
			setModalRes({
				laneId: laneId,
				toDelete: true, 
			});
			requestClose()
		}	
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
						onChange={(e)=>{setLaneNameValue(e.target.value)}} 
						type='text'
						placeholder={laneName}
						autoFocus
					/>
					<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: '5px'}}>
						<SaveBtn type='text' onClick={submit}>Save</SaveBtn>
						<DeleteBtn type='text' onClick={deleteLane}>Delete</DeleteBtn>
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