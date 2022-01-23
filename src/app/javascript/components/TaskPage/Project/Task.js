import React, { useRef, useState, forwardRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../DnD/itemTypes";
import styled from "styled-components";
import DatePicker from "react-datepicker"
import getMonth from "date-fns/getMonth"
import getYear from "date-fns/getYear"
import format from "date-fns/format"
import "react-datepicker/dist/react-datepicker.css";
import { updateTask } from "../../../actions/projectLayoutActions";
import { showUndoAlert } from "../../../actions/undoActions";
import { connect } from "react-redux";

import Tag from "./Tag";
import EditTaskModal from "../Modals/EditTaskModal";
import ClockIcon from "images/Clock_Icon.png"

const BaseDiv = styled.button`
  border-radius: 5px;
  // border: 1px solid var(--bg-gray);
  box-shadow: rgba(100, 100, 111, 0.1) 0px 0px 29px 0px;

  // flex: 1 0 0;
  width: 95%;
  min-width: 150px;
  max-width: 250px;
  min-height: 90px;
  max-height: 90px;
  background-color: white;

  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    box-shadow: rgba(100, 100, 111, 0.3) 0px 0px 35px 0px;

    transition: 100ms box-shadow;
  }
`

const TaskHeader = styled.a`
  width: 100%;
  height: fit-content;
  flex: 0 0 0;
  
  padding: 2px 5px 0px 5px;

  border: none;
  // border-bottom: 1px solid var(--light-gray);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  position: relative;

  text-align: start;
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
  padding: 0px 5px 5px 5px;

  display: flex;
  flex-direction: column;
  justify-content: stretch;
`

const TaskDesc = styled.a`
  font-size: 12px;
  line-height: 12px;
  text-align: left;
  white-space: pre-wrap;
  overflow-y: auto;
  color: rgb(136, 136, 136);

  min-height: 20px;
  flex: 1 0 0;

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
  // flex-flow: wrap;
  flex-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  column-gap: 2px;

  margin-bottom: 2px;
  margin-top: 2px;
`

const Task = ({
  path, laneId, data, showUndoAlert, updateTask 
}) => {
  const [showModal, setShowModal] = useState(false)
  const [dueDate, _setDueDate] = useState(Date.parse(data.duedate));

  const taskName = data.name
  const taskDesc = data.description
  const taskStarred = data.starred

  const DATE_FORMAT = "yyyy/MM/dd"
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: () => {
      return {
        type: ItemTypes.TASK,
        id: data.id,
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
    
    updateTask(laneId, data.id, {
      duedate: date !== null ? format(date, DATE_FORMAT) : null
    })
  }

  const DueDateInput = forwardRef(({ value, onClick }, ref) => (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <button onClick={onClick} style={{height:'12px', display:'flex', alignItems:'center', justifyContent:'stretch', columnGap:'2px'}}>
        <img src={ClockIcon} style={{height:'12px'}}/>
        <a style={{
          fontSize:'12px', 
          lineHeight:'12px',
          textAlign:'center',
          color: value == format(new Date(), DATE_FORMAT) ? 'var(--dark-red)' : 'rgb(140,140,140)' // TODO: better implementation?
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
          <button style={{color:'var(--dark-red)', border:'1px solid var(--dark-red)', borderRadius:'15px', padding:'0px 5px 0px 5px'}} onClick={()=> setDueDate(null)}>
            X
          </button>
        }
      </a>
      <button onClick={increaseMonth}>{'>'}</button>
    </div>
  }

  const completeTaskOnClick = () => {
    updateTask(laneId, data.id, {
      completed: true
    }, true)
    .then(resp => {
      return showUndoAlert()
    })
  }

  const keyboardUpEvent = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      setShowModal(true)
    }
  }

  return (
    <React.Fragment>
      <BaseDiv 
        ref={ref} 
        starred={taskStarred} 
        onDoubleClick={() => setShowModal(true)}
        onKeyUp={keyboardUpEvent}
      >
        <TaskHeader>
            {taskName}
          <CompleteBtn onClick={() => completeTaskOnClick(data.id)} starred={taskStarred} />
        </TaskHeader>
        <TaskContent>
          <TaskDesc>{taskDesc}</TaskDesc>
          { data.tags.length > 2
            ?  <React.Fragment>
              <TagsDiv>
                {
                  data.tags.map((tag, index) => 
                    <Tag key={index} data={tag}></Tag>
                  )
                }
              </TagsDiv>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                dateFormat={DATE_FORMAT}
                customInput={<DueDateInput />}
                renderCustomHeader={DueDateHeader}
              />
            </React.Fragment>
            : <div style={{display:'flex', alignItems:'end', justifyContent:'space-between'}}>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                dateFormat={DATE_FORMAT}
                customInput={<DueDateInput />}
                renderCustomHeader={DueDateHeader}
              />
              <TagsDiv>
                {
                  data.tags.map((tag, index) => 
                    <Tag key={index} data={tag}></Tag>
                  )
                }
              </TagsDiv>
            </div>
          }
        </TaskContent>
      </BaseDiv>
      <EditTaskModal laneId={laneId} taskData={data} showModal={showModal} setShowModal={setShowModal}/>
    </React.Fragment>
  )
}

export default connect(
  null,
  (dispatch) => ({
    showUndoAlert: () => dispatch(showUndoAlert()),
    updateTask: (...args) => dispatch(updateTask(...args))
  })
)(Task)

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