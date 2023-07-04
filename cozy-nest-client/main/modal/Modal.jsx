import React, {useEffect} from "react";
import {EventBus} from "./Module.jsx";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
    useDisclosure, useToast
} from "@chakra-ui/react";

export function CozyModalSimple() {

    const listen = 'CozyModalSimple'
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [text, setText] = React.useState('')

    useEffect(() => {
        // listen to events on listen

        const _eventFn = ({msg}) => {
            setText(msg)
            onOpen()
        }

        EventBus.on(listen, _eventFn)
        return () => {
            // unlisten to events on listen
            EventBus.off(listen, _eventFn)
        }
    }, [])

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>{text}</p>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export function CozyModalRich() {

    const listen = 'CozyModalRich'

    useEffect(() => {
        // listen to events on listen

        const _eventFn = (args) => {
            CozyLogger.debug("CozyModalRoot event", listen, args);
        }

        EventBus.on(listen, _eventFn)
        return () => {
            // unlisten to events on listen
            EventBus.off(listen, _eventFn)
        }
    }, [])

    return (
        <div className="CozyModalRich">
        </div>
    )
}

export function CozyToast() {
    const listen = 'CozyToast'
    const toast = useToast()

    useEffect(() => {
        // listen to events on listen

        const _eventFn = ({title, msg, status}) => {
            toast({
                title: title,
                description: msg,
                status: status,
                duration: 9000,
                isClosable: true,
            })
        }

        EventBus.on(listen, _eventFn)
        return () => {
            // unlisten to events on listen
            EventBus.off(listen, _eventFn)
        }
    }, [])

    return (
        <div className="CozyToast" />
    )
}


