import React, {useEffect} from "react";
import EventEmitter from 'eventemitter3';

class EventBusClass extends EventEmitter{
    constructor() {
        super();
    }
}
const EventBus = new EventBusClass();

function CozyModalRoot({listen, children}) {

    useEffect(() => {
        // listen to events on listen

        const _eventFn = () => {
            CozyLogger.debug("CozyModalRoot event", listen);
        }

        EventBus.on(listen, _eventFn)
        return () => {
            // unlisten to events on listen
            EventBus.off(listen, _eventFn)
        }
    }, [])

    return (
        <div className="CozyModal">
            {children}
        </div>
    )
}

export function CozyModalSimple() {
    return (
        <CozyModalRoot listen='CozyModalSimple'>
            <div className="CozyModalSimple">
            </div>
        </CozyModalRoot>
    )
}

export function CozyModalRich() {
    return (
        <CozyModalRoot listen='CozyModalRich'>
            <div className="CozyModalRich">
            </div>
        </CozyModalRoot>
    )
}


