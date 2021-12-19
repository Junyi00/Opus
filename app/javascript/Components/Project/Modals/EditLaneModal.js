import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
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
			// `onClose` is added by 'PopupManager' to props
			if (laneNameValue !== '' && laneNameValue !== laneName)
			setModalRes({
				laneId: laneId,
				toDelete: false, 
				newName: laneNameValue
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
			className={clsx(
				"fixed inset-0 z-10 flex items-center justify-center overflow-y-auto",
				{
					"bg-gray-900 bg-opacity-50": showModal === true,
				},
			)}
		>
			<Dialog.Overlay className="inset-0 z-5"/>

			<div className="flex flex-col row-gap-2 items-center justfiy-center bg-white p-5 border-gray-50 rounded-2xl">
				<Dialog.Title>Lane Title</Dialog.Title>
				<input 
					style={{textAlign: 'center'}}
					value={laneNameValue.trim()} 
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

		</Dialog>
  );

}

export default EditLaneModal