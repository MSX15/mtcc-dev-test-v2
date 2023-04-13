import React, { useState } from "react";
import { useEffect, useCallback } from "react";
import { DefaultClause } from "typescript";


function useEscapeKey(handleClose: Function) {
  const KEY_NAME_ESC = 'Escape';
  const KEY_EVENT_TYPE = 'keyup';
  const handleEscKey = useCallback((event: any) => {
    if (event.key === KEY_NAME_ESC) {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    document.addEventListener(KEY_EVENT_TYPE, handleEscKey, false);

    return () => {
      document.removeEventListener(KEY_EVENT_TYPE, handleEscKey, false);
    };
  }, [handleEscKey]);
}


interface SideDrawerProps
{ 
  isModal?: boolean, 
  isOpen: boolean, 
  isOpenChanged: Function, 
  showCloseButton?: boolean,
  onOpen?: Function,
  onClose?: Function, 
  useEscToClose?: boolean,
  children: any
}

export default function SideDrawer({ isModal = true, isOpen, isOpenChanged, showCloseButton, onOpen, onClose, useEscToClose, children }
  : SideDrawerProps

) {

  //TODO:: Need to fix the flow of control, (eg: onClose to be hit only when opened then closed, not on init render)
  isOpen
    ? onOpen && onOpen()
    : onClose && onClose()

  useEscapeKey(() => isOpenChanged(false))

  return (
    <>
      <div
        className={`${isModal && isOpen && "fixed top-0 left-0 z-[1000] h-screen w-screen bg-black bg-opacity-20"}`}
        onClick={() => { console.log("MODAL CLICK") }}
      ></div>
      <div
        className={`${isOpen ? "top-0 right-0" : "top-0 -right-[44rem]"} fixed z-[1001] h-full transition-all py-2 pr-2`}
        // className={`absolute top-0 right-0 h-full transition-all py-2 pr-2`}
        onClick={(e) => { e.stopPropagation(); }}
      >
        <div className={`h-full w-[42rem] relative overflow-auto bg-white shadow flex flex-col p-2 rounded-lg transition-all`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:cursor-pointer self-end"
            onClick={() => { console.log("CLOSE_BUTTON"); isOpenChanged(false); }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <div className="mt-2">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
