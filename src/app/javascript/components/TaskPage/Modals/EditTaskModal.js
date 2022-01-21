import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getCommonTags } from '../../../utils/databaseOps';
import { updateTask, deleteTask, createTags, deleteTags } from '../../../actions/projectLayoutActions'

import DraggableTag from "../DnD/DraggableTag"
import TagThrashZone from '../DnD/TagThrashZone';
import FlagOff from 'images/Flag_Off_Icon.png'
import FlagOn from 'images/Flag_On_Icon.png'
import Tag from '../Project/Tag';


const BaseDiv = styled.div`
  display: flex;
  flex-direction: row;
`

const GridContainer = styled.form`
  display: grid;

  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 3fr 1fr 0fr;
  grid-template-areas:
    "TaskLbl TaskText TaskText   Star  "
    "DescLbl DescText DescText DescText"
    "   .       .      DelBtn   SaveBtn"
	" Footer  Footer   Footer   Footer ";

  ${({ showWarning }) => showWarning && `
	grid-template-rows: 1fr 3fr 1fr 3fr;
  `}

  gap: 10px 5px;
`

const FormLabel = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;

  justify-content: end;
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

const StarBtn = styled.div`
	background-color: transparent;
	border: none;
`

const TagDiv = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 10px;
`

const DisplayTagsDiv = styled.div`
	border: 1px solid var(--light-gray);

	width: auto;
	max-width: 300px;
	min-height: 35px;
	flex-grow: 1;

	display: flex;
	padding: 5px;
	flex-direaction: row;
	flex-wrap: wrap;
	align-content: start;
	column-gap: 5px;
	row-gap: 5px;
`

const ColorBox = styled.label`
	display: inline-block;
	border: none;
	border-radius: 5px;

	width: 30px;
	height: 25px;

	background-color: ${props => props.color};
`

const InputColorBox = styled.input`
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
`

const ColorBoxWrapper = styled.div`
	width: fit-content;

	& input:checked + label {
		border: 2px solid gray;
	}
`

const EditTaskModal = ({
	showModal, setShowModal, laneId, taskData, tags, updateTask, deleteTask, createTags, deleteTags
}) => {
	const tagColors = ["#4ce4d6", "#a9d18e", "#ffd966", "#ea9846", "#f781f1", "#ef5a7e", "#adb9ca"]

	const [taskTitleValue, setTaskTitleValue] = useState(taskData.name)
	const [taskDescValue, setTaskDescValue] = useState(taskData.description)
	const [taskStarred, setTaskStarred] = useState(taskData.starred)
	const [newTagValue, setNewTagValue] = useState('')
	const [selectedColor, setSelectedColor] = useState(tagColors[0])
	const [displayTags, setDisplayTags] = useState(tags)
	const [tagsToDelete, setTagsToDelete] = useState([])

	const [showWarning, setShowWarning] = useState(false)

	const taskId = taskData.id

	const [commonTags, setCommonTags] = useState([])
	useEffect(() => {
		getCommonTags().then(resp => {
			const items = Object.keys(resp.data).map((key) => [key, resp.data[key]])
			items.sort((item1, item2) => item2[1] - item1[1])
			setCommonTags(items)
		})
	}, [])

	// Update tags with proper database tag details after new tags are created
	useEffect(()=>{
		setDisplayTags(tags)
	}, [tags])

	const handleDescInputOnFocus = (e) => {
		const textLength = e.target.value.length
		e.target.setSelectionRange(textLength, textLength)
	}

	const handleTitleInputOnFocus = (e) => {
		const textLength = e.target.value.length
		e.target.setSelectionRange(0, textLength)
	}

	const submitAction = () => {
		updateTask(laneId, taskId, {
			name: taskTitleValue.trim(),
			description: taskDescValue.trim(),
			starred: taskStarred
		}).then(resp => {
			const tagsToAdd = displayTags.filter((tag, index) => !('id' in tag))
			createTags(laneId, taskId, tagsToAdd).then(resp => {
				if (tagsToDelete.length > 0) {
					deleteTags(laneId, taskId, [...tagsToDelete])
					setTagsToDelete([])
				}
			})
		})
		
		requestClose()
	}

	const deleteAction = () => {
		if (!showWarning) {
			setShowWarning(true)
		}
		else {
			deleteTask(laneId, taskId)

			requestClose()
		}	
	}

	const requestClose = () => {
		setShowModal(false)
	}

	const starBtnOnClick = () => {
		setTaskStarred(!taskStarred)
	}

	const colorBoxesOnChange = (e) => {
		setSelectedColor(e.target.getAttribute('color'))
	}

	const addTagOnClick = () => {
		const tagName = newTagValue

		if (tagName == "" ) { return }

		addTag(newTagValue, selectedColor)

		setNewTagValue('')
	}

	const removeTagOnDrop = (item) => {
		setDisplayTags([
			...displayTags.slice(0, item.index),
			...displayTags.slice(item.index + 1)
		])
		
		if ('tagId' in item && item.tagId !== undefined) { 
			// DraggableTag has a tag id from the db
			setTagsToDelete([
				...tagsToDelete,
				item
			])
		}
	}

	const addTag = (name, color) => {
		setDisplayTags([
			...displayTags,
			{
				name: name,
				color: color,
				taskId: taskId
			}
		])
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

				<BaseDiv 
					className='bg-white p-5 border-gray-50 rounded-2xl z-10'
				>
					<GridContainer onSubmit={submitAction} showWarning={showWarning}>
						<FormLabel htmlFor='TaskText' style={{gridArea:'TaskLbl'}}>Task</FormLabel>
						<input 
							id='TaskText'
							className='text_input'
							aria-label="Task Name"
          		aria-required="false"
							value={taskTitleValue} 
							onKeyUp={(e) => {e.key == "Enter" ? submitAction() : null}}
							onChange={(e)=>{setTaskTitleValue(e.target.value)}} 
							onFocus={handleTitleInputOnFocus}
							type='text'
							style={{gridArea:'TaskText'}} 
							autoFocus
						/>

						<div style={{gridArea:'Star', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
							<StarBtn onClick={starBtnOnClick}>
								<img src={(taskStarred ? FlagOn : FlagOff)} style={{width:'15px'}}></img>
							</StarBtn>
						</div>

						<FormLabel htmlFor='DescText' style={{gridArea:'DescLbl'}}>Description</FormLabel>
						<textarea 
							id='DescText'
							className='text_input'
							aria-label="Project Name"
							aria-required="false"
							value={taskDescValue} 
							placeholder="A description...."
							onChange={(e)=>{setTaskDescValue(e.target.value)}} 
							onFocus={handleDescInputOnFocus}
							type='text' 
							style={{gridArea:'DescText', resize:'none'}} 
						/>

						<ModalBtn type='submit' color='var(--highlight-color)' style={{gridArea:'SaveBtn'}}>Save</ModalBtn>
						<ModalBtn type='button' onClick={deleteAction} color='var(--dark-red)' style={{gridArea:'DelBtn'}}>Delete</ModalBtn>
						{
							!showWarning ? null :
								<div style={{gridArea:'Footer', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
									<hr style={{height: '1px', width: '100%', margin: '5px'}}></hr>
									<a>Are you sure you want to delete this task?</a><br />
									<a>Click the button again to confirm</a>
								</div>
						}
					</GridContainer>

					<div style={{borderLeft:'1px solid var(--light-gray)', height:'auto', margin:'0px 10px'}}></div>

					<TagDiv>
						<div style={{display:'flex', flexDirection:'row', alignItems:'center', columnGap:'5px'}}>
							<label htmlFor='AddTag'>Add Tag</label>
							<input 
								id='AddTag'
								className='text_input'
								aria-label="Add Tag"
								aria-required="false"
								value={newTagValue.trim().toLowerCase()} onKeyUp={(e) => {e.key == "Enter" ? addTagOnClick() : null}}
								onChange={(e)=>{setNewTagValue(e.target.value)}} 
								type='text' 
							/>
							<ModalBtn type='button' onClick={addTagOnClick}>Add</ModalBtn>
						</div>
						<div onChange={colorBoxesOnChange} style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
							{
								tagColors.map((tagColor, index) => (
									<ColorBoxWrapper key={index}>
										<InputColorBox id={index} type='radio' name='colorboxes' color={tagColor} defaultChecked={index===0}/>
										<ColorBox htmlFor={index} color={tagColor}></ColorBox>
									</ColorBoxWrapper>
								))
							}
						</div>
						<div style={{display:'flex', flexDirection:'row', alignItems:'center', columnGap: '10px'}}>
							<DisplayTagsDiv className="rounded-2xl">
								{
									displayTags.map((tag, index) => <DraggableTag key={index} index={index} data={tag} />)
								}
							</DisplayTagsDiv>
							<TagThrashZone onDrop={removeTagOnDrop} />
						</div>
						<div style={{display:'flex', flexDirection:'row', alignItems:'center', columnGap: '10px'}}>
							<a>Common Tags: </a>
							{
								commonTags.slice(0, 3).map((item, index) => {
									const key = eval(item[0])
									const tag = {
										name: key[0],
										color: key[1],
										id: null
									}
									return (
										<button 
											key={index}
											style={{backgroundColor:'transparent', width:'fit-content', height:'fit-content', border:'none'}}
											onDoubleClick={()=>{addTag(tag.name, tag.color)}}	
										>
											<Tag data={tag} onDoubleClick={()=>{addTag(tag.name, tag.color)}} />
										</button>
									)
								})
							}
						</div>
					</TagDiv>
				</BaseDiv>
			</div>
		</Dialog>
  );

}

export default connect(
	null,
	(dispatch) => ({
		updateTask: (...args) => dispatch(updateTask(...args)),
		deleteTask: (...args) => dispatch(deleteTask(...args)),
		createTags: (...args) => dispatch(createTags(...args)),
		deleteTags: (...args) => dispatch(deleteTags(...args)),
	})
)(EditTaskModal)