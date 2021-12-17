import React, { useState } from "react";
import styled from "styled-components"

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
  border-right: 1px solid var(--light-gray);

  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
`

const TitleText = styled.b`
  // background-color: #0ae0f0;
  // border: 1px solid #0ae0f0;
  border-radius: 10px;

  color: var(--highlight-color);

  padding: 2px;
`

const ProjectsList = styled.ul`
  padding-left: 0px; 
  margin-top: 10px;
  text-align: center;

  list-style: none;
  // list-style-type: '> ';

  // li:before {
  //   content: '>'
  // }
`

const ProjectsItem = styled.li`
  margin-top: 5px;
  margin-bottom: 5px;

  > button {
    color: gray;
    ${({ selected }) => selected && `
    color: black;`}
  }
`

const ProjectButton = styled.button`
  background-color: transparent;
  border: none;

  font-size: 15px;
`

const AddProjectBtn = styled.button`
  background-color: transparent;
  border: none;
  margin-top: 5px;

  width: 15px;
  height: 15px;

  color: var(--highlight-color);

  &:hover {
    border: 1px solid var(--highlight-color);
    border-radius: 15px;
  }
`

const SideBar = (props) => {
  const isLoading = props.isLoading
  const projects = props.projects
  const projOnClick = props.onClick
  const addProjOnClick = props.addProjOnClick

  const [selectedIndex, setSelectedIndex] = useState(-1)

  const createButtonOnClick = (index) => {
    const fn = projOnClick(index)
    return () => {
      setSelectedIndex(index)
      fn()
    }
  }

  const createProjectsElements = (projects, projOnClick, selectedIndex) => {
    return projects.map((project, index) => {
      return (
        <ProjectsItem selected={index == selectedIndex} id={project.name} key={index}>
          <ProjectButton onClick={createButtonOnClick(index)}>
            {project.name}
          </ProjectButton>
        </ProjectsItem>)
    })
  }

  return (
    <Base>
      <TitleText>Projects</TitleText>
      {
        isLoading
          ? <a>Loading...</a>
          : <ProjectsList>
            {createProjectsElements(projects, projOnClick, selectedIndex)}
            <AddProjectBtn onClick={addProjOnClick}>+</AddProjectBtn>
          </ProjectsList>
      }
    </Base>
  )
}

export default SideBar