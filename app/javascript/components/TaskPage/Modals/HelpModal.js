import React, { useState, useRef, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import styled from 'styled-components'

import Page1 from "images/guides/Page1.png"
import Page2 from "images/guides/Page2.png"
import Page3 from "images/guides/Page3.png"
import Page4 from "images/guides/Page4.png"

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

const HelpModal = ({
  showModal, setShowModal
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const dummyInitialRef = useRef(null)

  const [isScrolling, setIsScrolling] = useState(false)
  // const [scrollLeft, setScrollLeft] = useState(0)
  const [clientX, setClientX] = useState(0)

  const scrollDivRef = useRef(null)

  const TOTAL_PAGES = 4;

  useEffect(() => {
    if (scrollDivRef && showModal) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      window.addEventListener('mousedown', onMouseDown)
    }
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousedown', onMouseDown)
    }
  }, [scrollDivRef, showModal, isScrolling, clientX])

  const onMouseMove = (event) => {
    if (isScrolling) {
      console.log(scrollDivRef.current.scrollLeft, clientX, event.clientX)
      const dragDiff = (clientX - event.clientX) * 1.5 // increase sensitivity
      scrollDivRef.current.scrollLeft = scrollDivRef.current.scrollLeft + dragDiff
    }
  };

  const onMouseUp =  () => {
    console.log("RESET")
    setIsScrolling(false)
    setClientX(0)
  };

  const onMouseDown = (event) => {
    console.log("INITIAL CLIENTX: " + event.clientX)
    setIsScrolling(true)
    setClientX(event.clientX)
  };

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
          <SlidesDiv ref={scrollDivRef} onMouseDown={()=>{}}>
            <PageDiv id='page0'>
              <b>Projects - Lanes - Tasks</b> 
              <img draggable="false" src={Page1}/>
            </PageDiv>
            <PageDiv id='page1'>
              <b>Drag and Drop!</b> 
              <img draggable="false" src={Page2} />
            </PageDiv>
            <PageDiv id='page2'>
              <b>The Header</b> 
              <img draggable="false" src={Page3} />
            </PageDiv>
            <PageDiv id='page3'>
              <b>Editing Task!</b> 
              <img draggable="false" src={Page4} />
            </PageDiv>
          </SlidesDiv>
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