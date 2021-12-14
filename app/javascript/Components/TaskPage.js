import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import SideBar from './SideBar'

const VerticalContentDiv = styled.div`
  display: flex;
  flex-flow: column; 
  height: 100%;
`

const HorizontalContentDiv = styled.div`
  display: flex;
  flex-flow: row; 
  width: 100%;
`

const GrowDiv = styled.div`
  display: flex;
  flex: 1 1 auto;
`

const TaskPage = () => {

  return (
    <VerticalContentDiv>
      <Header />

      <GrowDiv>
        <HorizontalContentDiv>
          <SideBar />
          
          <GrowDiv>
            <div>
              Content!
            </div>
            </GrowDiv>
          </HorizontalContentDiv>
      </GrowDiv>
    </VerticalContentDiv>
  )
}

export default TaskPage