import React, {useRef} from 'react'
import {useDisclosure} from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react'
import {Button} from "../image-browser/App.jsx";

export function ButtonWithConfirmDialog({message, buttonLabel, confirmLabel, cancelLabel, onConfirm, style}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const _buttonLabel = buttonLabel || confirmLabel

  if (style) {
    style = {...style, width: '100%'}
  }
  else
    style = {width: '100%'}

  return (
    <>
      <Button
        className="btn-settings"
        style={style}
        onClick={onOpen}
      >{_buttonLabel}</Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        variant="nevysha-confirm"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Confirm Action
            </AlertDialogHeader>

            <AlertDialogBody>
              {message}
            </AlertDialogBody>

            <AlertDialogFooter>
              <button
                className="btn-settings"
                ref={cancelRef}
                onClick={onClose}>
                {cancelLabel}
              </button>
              <button
                className="btn-settings"
                onClick={() => {
                  onClose();
                  onConfirm();
                }}>
                {confirmLabel}
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}