import React, { useState   } from "react";
import styled from "styled-components"
import { useSelector, useDispatch } from "react-redux";

import EditProjectModal from "./Modals/EditProjectModal";
import HelpModal from "./Modals/HelpModal"
import { createProject, selectProject } from "../../actions/projectsActions";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: fixed;
  top: var(--header-height);
  bottom: 0px;
  left: 0;
  width: var(--sidebar-width);
  z-index: 1;

  background-color: #fcfcfc;
  // border-right: 1px solid var(--light-gray);
  box-shadow: rgba(100, 100, 111, 0.1) 7px 0px 29px 0px;

  padding: 10px;
`

const TitleText = styled.b`
  border-radius: 10px;

  color: var(--highlight-color);

  padding: 2px;
`

const ProjectsList = styled.ul`
  padding-left: 0px; 
  margin-top: 10px;
  text-align: center;

  width: 100%;

  list-style: none;
  // list-style-type: '> ';

  // li:before {
  //   content: '>'
  // }
`

const ProjectsItem = styled.li`

  > button {
    width: 100%;

    padding: 5px;
    // border-radius: var(--standard-br);
    border-width: 0px 0px 0px 1px;
    border-style: solid;
    border-color: var(--light-gray);
    color: var(--dark-gray);

    ${({ selected }) => selected && `
      color: var(--highlight-color);
      // background-color: var(--bg-gray);
      border-color: var(--highlight-color);
    `}
  }
`

const ProjectButton = styled.button`
  background-color: transparent;
  border: none;

  font-size: 15px;

  &:hover {
    color: var(--highlight-color);
  }
`

const NewProjectBtn = styled.button`
  background-color: transparent;
  border: none;
  margin-top: 5px;

  width: 15px;
  height: 15px;
  line-height: 15px;
  text-align: center;

  color: var(--highlight-color);

  &:hover {
    border: 1px solid var(--highlight-color);
    border-radius: 15px;

    transition: 150ms all;
  }
`

const GuideBtn = styled.button`
  background-color: transparent;
  border-color: gray;
  border-width: 1px 0px 1px 0px;
  padding: 5px 0px 5px 0px;

  color: var(--dark-gray);

  &:hover {
    padding: 0px;
    margin-bottom: 5px;
    border-color: var(--highlight-color);
    color: var(--highlight-color);

    transition: 100ms all;
  }

  margin-top: auto; // align button to the bottom
`

const SideBar = (props) => {
  const [showProjModal, setShowProjModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const isLoading = props.isLoading

  const dispatch = useDispatch()
  const userState = useSelector((state) => state.user)
  const projects = useSelector((state) => state.projects.projects)
  const selectedIndex = useSelector((state) => state.projects.selectedIndex)

  const addProjOnClick = () => {
    dispatch(createProject(userState.id))
  }

  const createButtonOnClick = (index) => {
    return () => dispatch(selectProject(index))
  }

  const createProjectsElements = () => {
    return projects.map((project, index) => {
      return (
        <ProjectsItem selected={index == selectedIndex} id={project.name} key={index}>
          <ProjectButton 
            onClick={createButtonOnClick(index)} 
            onDoubleClick={() => setShowProjModal(true)}
          >
            {project.name}
          </ProjectButton>
        </ProjectsItem>)
    })
  }

  return (
    <React.Fragment>
      <Base>
        <TitleText>Projects</TitleText>
        {
          isLoading
            ? <a>Loading...</a>
            : <ProjectsList>
              {createProjectsElements()}
              <NewProjectBtn onClick={addProjOnClick}>+</NewProjectBtn>
            </ProjectsList>
        }
        <GuideBtn onClick={()=> setShowHelpModal(true)}>Guide</GuideBtn>
      </Base>
      <EditProjectModal showModal={showProjModal} setShowModal={setShowProjModal} projects={projects} />
      <HelpModal showModal={showHelpModal} setShowModal={setShowHelpModal}></HelpModal>
    </React.Fragment>
  )
}

export default SideBar