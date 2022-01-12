import React, { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import styled from 'styled-components'

import Page1 from "images/guides/Page1.png"
import Page2 from "images/guides/Page2.png"

const BaseDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  width: 90%;
  max-height: 95vh; // prevent from exceeding the height of the screen

  background-color: white;

  position: relative;
`

const SlidesDiv = styled.div`
  display: flex;
    
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  width: 100%;

  position: relative;

  & > div {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: 100%;
    height: fit-content;
    margin-right: 50px;
    background: white;
    transform-origin: center center;
    transform: scale(1);
    transition: transform 0.5s;
    position: relative;
  }

  ::-webkit-scrollbar {
    height: 0px;
    width: 0px;
    display: none;
  }
`

const PageDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-size: 25px;

  & > b {
    font-size: 3vw; // scale font with size of container
  }

  & > img {
    width: 80%;
  }
`

const Dot = styled.a`
  width: 15px;
  height: 15px;

  background-color: gray;
  border-radius: 50px;

  ${({ selected }) => selected && `
    background-color: var(--highlight-color);
  `}
`

const NavBtn = styled.a`
  position: absolute;
  width: 10%;
  height: 100%;
  background-color: transparent;

  top: 0px;
  ${({ isLeft }) => isLeft && ` 
    left: 0px;
    border-top-left-radius: 1em;
    border-bottom-left-radius: 1em;
  `}
  ${({ isRight }) => isRight && ` 
    right: 0px;
    border-top-right-radius: 1em;
    border-bottom-right-radius: 1em;
  `}

  &:hover {
    background-color: var(--light-gray);
    opacity: 30%;
  }

  &:focus {
    background-color: var(--highlight-color);
    opacity: 30%;
  }
`

const HelpModal = ({
  showModal, setShowModal
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const dummyInitialRef = useRef(null)

  const TOTAL_PAGES = 2;

  return (
    <Dialog
      open={showModal}
      onClose={() => {setSelectedIndex(0); setShowModal(false)}}
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      initialFocus={dummyInitialRef}
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 z-5 bg-black bg-opacity-25" />
        
        <BaseDiv className='rounded-2xl p-5 z-10'>
          <SlidesDiv>
            <PageDiv id='page0'>
              <b>Projects - Lanes - Tasks</b> 
              <img draggable="false" src={Page1}/>
            </PageDiv>
            <PageDiv id='page1'>
              <b>Drag and Drop!</b> 
              <img draggable="false" src={Page2} />
            </PageDiv>
          </SlidesDiv>
          <NavBtn 
            isLeft 
            href={'#page' + (selectedIndex == 0 ? selectedIndex : selectedIndex - 1)}
            onClick={()=>setSelectedIndex(selectedIndex == 0 ? selectedIndex : selectedIndex - 1)} 
          />
          <NavBtn 
            isRight 
            href={'#page' + (selectedIndex == TOTAL_PAGES - 1 ? selectedIndex : selectedIndex + 1)} 
            onClick={()=>setSelectedIndex(selectedIndex == TOTAL_PAGES - 1 ? selectedIndex : selectedIndex + 1)} 
          />
          <div style={{display:'flex', width:'fit-content', alignItems:'center', columnGap:'5px'}}>
            {
              [...Array(TOTAL_PAGES)].map((_, index) => 
                <Dot 
                  key={index}
                  href={`#page${index}`} 
                  onClick={()=>setSelectedIndex(index)} 
                  selected={selectedIndex == index} 
                  ref={dummyInitialRef} // dummy focus so it avoids defaulting to the navigation button
                />              
              )
            }
          </div>
        </BaseDiv>
      </div>
    </Dialog>
  )
}

export default HelpModal