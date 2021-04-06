import React from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

const TaskHander: React.FC<{socket: Socket<DefaultEventsMap, DefaultEventsMap>}> = ({socket}) => {

    return (
        {activeTasks.map((value, i) => {
            return <TaskComp Task={value} key={i}/>
        })}
    )
}