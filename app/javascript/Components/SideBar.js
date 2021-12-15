import React from "react";
import styled from "styled-components";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;

  background-color: #fcfcfc;

  border-right: 1px solid gray;

  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
`

const TitleText = styled.b`
  background-color: #0ae0f0;
  border: 1px solid #0ae0f0;
  border-radius: 10px;

  padding: 2px;
`

const ProjectsList = styled.ul`
  padding-left: 0px; 
  margin-top: 10px;

  list-style: none;
  // list-style-type: '> ';

  li:before {
    content: '>'
  }
`

const ProjectButton = styled.button`
  background-color: transparent;
  border: none;

  font-size: 15px;
`

const createProjectsElements = (projects, projOnClick) => {
  return projects.map((project, index) => {
    return (<li id={project.attributes.name} key={index}><ProjectButton onClick={projOnClick(index)}>{project.attributes.name}</ProjectButton></li>)
  })
}

const SideBar = (props) => {
  const isLoading = props.isLoading
  const projects = props.projects
  const projOnClick = props.onClick

  return (
    <Base>
      <TitleText>Projects</TitleText>
      {
        isLoading
          ? <a>Loading...</a>
          : <ProjectsList>
            {createProjectsElements(projects, projOnClick)}
          </ProjectsList>
      }
    </Base>
  )
}

export default SideBar