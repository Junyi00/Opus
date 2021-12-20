import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import DraggableTag from "./DraggableTag"
import TagThrashZone from './TagThrashZone';
import FlagOff from 'images/Flag_Off_Icon.png'
import FlagOn from 'images/Flag_On_Icon.png'

const SaveBtn = styled.button`
  background-color: transparent;
  border: 1px solid var(--highlight-color);
  border-radius: 5px;
  color: var(--highlight-color);

  padding: 2px;
  margin-top: 5px;

  gridArea: SaveBtn;
`

const DeleteBtn = styled.button`
  background-color: transparent;
  border: 1px solid var(--dark-red);
  border-radius: 5px;
  color: var(--dark-red);

  padding: 2px;
  margin-top: 5px;

  gridArea: DelBtn;
`

const BaseDiv = styled.div`
  display: flex;
  flex-direction: row;
`

const GridContainer = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 3fr 1fr;
  grid-template-areas:
    "TaskLbl TaskText TaskText   Star  "
    "DescLbl DescText DescText DescText"
    "   .       .      DelBtn   SaveBtn  ";

  gap: 5px;
`

const LabelDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  justify-content: end;
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

const AllTagsDiv = styled.div`
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
	// flex: 1 0 0;

	& input:checked + label {
		border: 1px solid gray;
	}
`

const EditTaskModal = (props) => {
	const tagColors = ["#4ce4d6", "#a9d18e", "#ffd966", "#ea9846", "#f781f1", "#ef5a7e", "#adb9ca"]

	const [taskTitleValue, setTaskTitleValue] = useState(props.taskData.name)
	const [taskDescValue, setTaskDescValue] = useState(props.taskData.description)
	const [taskStarred, setTaskStarred] = useState(props.taskData.starred)
	const [newTagValue, setNewTagValue] = useState('')
	const [selectedColor, setSelectedColor] = useState(tagColors[0])
	const [tags, setTags] = useState(props.tags)
	const [tagsToDelete, setTagsToDelete] = useState([])

	const [showWarning, setShowWarning] = useState(false)

	const showModal = props.showModal
	const setShowModal = props.setShowModal
	const setModalRes = props.setModalRes
	const taskId = props.taskData.id

	useEffect(()=>{
		setTags(props.tags)
	}, [props.tags])

	const submitAction = () => {
		setModalRes({
			taskId: taskId, 
			toDelete: false, 
			data: {
				name: taskTitleValue,
				description: taskDescValue.trim(),
				starred: taskStarred
			},
			tagsToAdd: tags.filter((tag, index)=> !('tagId' in tag)),
			tagsToDelete: [...tagsToDelete]
		});
		setTagsToDelete([])
		requestClose()
	}

	const requestClose = () => {
		setShowModal(false)
	}

	const deleteAction = () => {
		if (!showWarning) {
			setShowWarning(true)
		}
		else {
			setModalRes({
				taskId: taskId,
				toDelete: true, 
			});
			requestClose()
		}	
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

		setTags([
			...tags,
			{
				name: newTagValue,
				color: selectedColor,
				taskId: taskId
			}
		])

		setNewTagValue('')
		
	}

	const removeTagOnDrop = (item) => {
		setTags([
			...tags.slice(0, item.index),
			...tags.slice(item.index + 1)
		])
		
		if ('tagId' in item) {
			setTagsToDelete([
				...tagsToDelete,
				item
			])
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
		)}>
			<Dialog.Overlay className="inset-0 z-5"/>

			<BaseDiv className='bg-white p-5 border-gray-50 rounded-2xl'>
        <GridContainer>
          <LabelDiv style={{gridArea:'TaskLbl'}}>Task</LabelDiv>
          <input 
						value={taskTitleValue.trim()} 
						onChange={(e)=>{setTaskTitleValue(e.target.value)}} 
						type='text'
						style={{gridArea:'TaskText'}} 
					/>

					<div style={{gridArea:'Star', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
						<StarBtn onClick={starBtnOnClick}>
							<img src={(taskStarred ? FlagOn : FlagOff)} style={{width:'15px'}}></img>
						</StarBtn>
					</div>

          <LabelDiv style={{gridArea:'DescLbl'}}>Description</LabelDiv>
          <textarea 
						value={taskDescValue} 
						onChange={(e)=>{setTaskDescValue(e.target.value)}} 
						type='text' 
						style={{gridArea:'DescText', resize:'none'}} 
					/>

          <SaveBtn onClick={submitAction} style={{gridArea:'SaveBtn'}}>Save</SaveBtn>
          <DeleteBtn onClick={deleteAction} style={{gridArea:'DelBtn'}}>Delete</DeleteBtn>
        </GridContainer>

        <div style={{borderLeft:'1px solid var(--light-gray)', height:'auto', margin:'0px 10px'}}></div>

        <TagDiv>
          <div style={{display:'flex', flexDirection:'row', alignItems:'center', columnGap:'5px'}}>
						<a>Add Tag</a>
						<input 
							value={newTagValue.trim()} 
							onChange={(e)=>{setNewTagValue(e.target.value)}} 
							type='text' 
						/>
						<button onClick={addTagOnClick}>Add</button>
					</div>
					<div onChange={colorBoxesOnChange} style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
						{
							tagColors.map((tagColor, index) => (
								<ColorBoxWrapper key={index}>
									<InputColorBox id={index} type='radio' name='colorboxes' color={tagColor} defaultChecked={index===0}/>
									<ColorBox for={index} color={tagColor}></ColorBox>
								</ColorBoxWrapper>
							))
						}
					</div>
					<div style={{display:'flex', flexDirection:'row', alignItems:'center', columnGap: '10px'}}>
						<AllTagsDiv className="rounded-2xl">
							{
								tags.map((tag, index) => <DraggableTag key={index} index={index} data={tag} />)
							}
						</AllTagsDiv>
						<TagThrashZone onDrop={removeTagOnDrop} />
					</div>
        </TagDiv>
      </BaseDiv>
			{
				!showWarning ? null :
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<hr style={{height: '1px', width: '100%', margin: '5px'}}></hr>
						<a>Are you sure you want to delete this task?</a><br />
						<a>Click the button again to confirm</a>
					</div>
			}
		</Dialog>
  );

}

export default EditTaskModal