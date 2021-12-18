import React, { useState } from "react";
import styled from "styled-components"
import { withPopups } from "react-popup-manager";

import EditProjectModal from "./Project/EditProjectModal";

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

class SideBar extends React.Component {
  constructor(props) {
    super(props)
    this.props = props

    this.state = {
      selectedIndex: -1
    }
  }

  render() {
    const isLoading = this.props.isLoading
    const projects = this.props.projects
    const projOnClick = this.props.onClick
    const addProjOnClick = this.props.addProjOnClick
    const editProjName = this.props.editProjName
    const delProj = this.props.delProj

    const openProjectEditor = (projName, projId) => {
      this.props.popupManager.open(EditProjectModal, {
        projName: projName, 
        onClose: (...params) => {
          const [toDelete, newName] = params;
          if (!toDelete) {
            if (newName !== projName && newName != "") {
              editProjName(projId, newName)
            }
          }
          else {
            delProj(projId)
          }
        }}); 
    }

    const createButtonOnClick = (index) => {
      const fn = projOnClick(index)
      return () => {
        this.setState({selectedIndex: index})
        fn()
      }
    }

    const createProjectsElements = (projects, projOnClick, selectedIndex) => {
      return projects.map((project, index) => {
        return (
          <ProjectsItem selected={index == selectedIndex} id={project.name} key={index}>
            <ProjectButton onClick={createButtonOnClick(index)} onDoubleClick={() => openProjectEditor(project.name, project.id)}>
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
              {createProjectsElements(projects, projOnClick, this.state.selectedIndex)}
              <AddProjectBtn onClick={addProjOnClick}>+</AddProjectBtn>
            </ProjectsList>
        }

      </Base>
    )

  }
}

const WrappedSideBar = withPopups()(SideBar)
export {WrappedSideBar as SideBar};