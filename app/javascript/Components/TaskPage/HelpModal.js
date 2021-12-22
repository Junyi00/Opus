import { Dialog } from '@headlessui/react'
import React from 'react'
import styled from 'styled-components'

import Page1 from "images/guides/Page1.png"
import Page2 from "images/guides/Page2.png"

const SlidesDiv = styled.div`
  display: flex;
    
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  width: 800px;

  & > div {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: 800px;
    height: 550px;
    margin-right: 50px;
    background: white;
    transform-origin: center center;
    transform: scale(1);
    transition: transform 0.5s;
    position: relative;
  }

  & > img {
    width: 800px;
  }

  ::-webkit-scrollbar {
    height: 0px;
    width: 0px;
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--light-gray);
  }
`

const PageDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-size: 25px;
`

const Dot = styled.a`
  width: 15px;
  height: 15px;

  background-color: gray;
  border-radius: 50px;
`

const HelpModal = (props) => {

  const showModal = props.showModal
  const setShowModal = props.setShowModal

  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(false)}
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 z-5 bg-black bg-opacity-25" />
        
        <div className='rounded-2xl p-5 z-10' style={{display:'flex', flexDirection:'column', width:'fit-content', alignItems:'center', backgroundColor:'white'}}>
          <SlidesDiv>
            <PageDiv id='page1'>
              <b>Projects - Lanes - Tasks</b> 
              <img src={Page1}/>
            </PageDiv>
            <PageDiv id='page2'>
              <b>Drag and Drop!</b> 
              <img src={Page2} />
            </PageDiv>
          </SlidesDiv>
          <div style={{display:'flex', width:'fit-content', alignItems:'center', columnGap:'5px'}}>
            <Dot href="#page1"></Dot>
            <Dot href="#page2"></Dot>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default HelpModal