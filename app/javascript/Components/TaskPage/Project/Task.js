import React, { useRef, useState, forwardRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./DnD/ItemTypes";
import styled from "styled-components";
import DatePicker from "react-datepicker"
import getMonth from "date-fns/getMonth"
import getYear from "date-fns/getYear"
import format from "date-fns/format"
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";

import Tag from "./Tag";
import EditTaskModal from "./Modals/EditTaskModal";
import ClockIcon from "images/Clock_Icon.png"
import { updateTask } from "../../../actions/projectLayoutActions";
import { showUndoAlert } from "../../../actions/undoActions";

const BaseDiv = styled.div`
  border-radius: 5px;
  box-shadow: rgba(100, 100, 111, 0.1) 0px 0px 29px 0px;

  flex: 1 0 0;
  width: 95%;
  min-width: 200px;
  max-width: 300px;
  min-height: 100px;
  max-height: 100px;
  background-color: white;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const TaskHeader = styled.a`
  width: 100%;
  height: fit-content;
  flex: 0 0 0;
  
  padding: 2px 5px 2px 5px;
  margin-top: 0px;

  border: none;
  border-bottom: 1px solid var(--light-gray);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  position: relative;

  text-overflow: ellipsis;
  overflow-x: clip;
`

const CompleteBtn = styled.button`
  background-color: transparent;
  border: 2px solid var(--light-gray);
  border-radius: 10px;

  ${({ starred }) => starred && `
    border-color: #e6c923;
  `}

  position: absolute;
  width: 15px; 
  height: 15px;
  right: 5px;
  top: 50%;

  transform: translate(0%, -50%);

  &:hover {
    background-color: #e6c923;
  }
`

const TaskContent = styled.div`
  flex: 1 0 0;
  width: 100%;
  padding: 5px;

  font-size: 15px;
  line-height: 15px;
  white-space: pre-wrap;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  justify-content: stretch;

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: rgb(136, 136, 136);
  }
`

const TagsDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  column-gap: 2px;
`

const Task = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [dueDate, _setDueDate] = useState(Date.parse(props.data.duedate));

  const path = props.path
  const taskName = props.data.name
  const taskDesc = props.data.description
  const taskStarred = props.data.starred
  const dispatch = useDispatch()

  const DATE_FORMAT = "yyyy/MM/dd"
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: () => {
      return {
        type: ItemTypes.TASK,
        id: props.data.id,
        path: path
    }},
    collect: monitor => ({
        isDragging: monitor.isDragging()
    })
  }), [path, taskStarred]);

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const setDueDate = (date) => {
    _setDueDate(date)
    
    dispatch(updateTask(props.laneId, props.data.id, {
      duedate: date !== null ? format(date, DATE_FORMAT) : null
    }))
  }

  const DueDateInput = forwardRef(({ value, onClick }, ref) => (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
      <button onClick={onClick} style={{height:'12px', display:'flex', alignItems:'center', justifyContent:'stretch', columnGap:'2px'}}>
        <img src={ClockIcon} style={{height:'12px'}}/>
        <a style={{
          fontSize:'12px', 
          lineHeight:'12px',
          color: value == format(new Date(), DATE_FORMAT) ? 'var(--dark-red)' : 'black' // TODO: better implementation?
        }}>{value}</a>
      </button>
    </div>
  ));

  const DueDateHeader = ({date, decreaseMonth, increaseMonth}) => {
    return <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0px 5px 0px 5px'}}>
      <button onClick={decreaseMonth}>{'<'}</button>
      <a>
        {`${months[getMonth(date)]} ${getYear(date)} `}
        { dueDate !== null && !isNaN(dueDate) &&
          <button style={{color:'var(--dark-red)', border:'1px solid var(--dark-red)', borderRadius:'15px', padding:'0px 3px 0px 3px'}} onClick={()=> setDueDate(null)}>
            X
          </button>
        }
      </a>
      <button onClick={increaseMonth}>{'>'}</button>
    </div>
  }

  const completeTaskOnClick = () => {
    dispatch(updateTask(props.laneId, props.data.id, {
      completed: true
    }, true))
    .then(resp => {
      return dispatch(showUndoAlert())
    })
  }

  return (
    <React.Fragment>
      <BaseDiv ref={ref} starred={taskStarred} onDoubleClick={()=> setShowModal(true)}>
        <TaskHeader>
          {/* <TaskTitleBtn onDoubleClick={()=> setShowModal(true)}> */}
            {taskName}
          {/* </TaskTitleBtn> */}
          <CompleteBtn onClick={() => completeTaskOnClick(props.data.id)} starred={taskStarred}></CompleteBtn>
        </TaskHeader>
        <TaskContent>
          <TagsDiv>
            {
              props.data.tags.map((tag, index) => 
                <Tag key={index} data={tag}></Tag>
              )
            }
          </TagsDiv>
          <a style={{fontSize: '12px', flex:'1 0 0'}}>{taskDesc}</a>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat={DATE_FORMAT}
            customInput={<DueDateInput />}
            renderCustomHeader={DueDateHeader}
          />
        </TaskContent>
      </BaseDiv>
      <EditTaskModal laneId={props.laneId} tags={props.data.tags} taskData={props.data} showModal={showModal} setShowModal={setShowModal}/>
    </React.Fragment>
  )
}

export default Task

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];