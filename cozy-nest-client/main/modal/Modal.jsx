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

export function CozyToast({registerReady}) {
    const listen = 'CozyToast'
    const toast = useToast()

    useEffect(() => {
        // listen to events on listen

        const _eventFn = ({title, msg, status, duration}) => {
            duration = duration || 9000
            toast({
                title: title,
                description: msg,
                status: status,
                duration: duration,
                isClosable: true,
            })
        }

        EventBus.on(listen, _eventFn)
        registerReady()
        return () => {
            // unlisten to events on listen
            EventBus.off(listen, _eventFn)
        }
    }, [])

    return (
        <div className="CozyToast" />
    )
}


