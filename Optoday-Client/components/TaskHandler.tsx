import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import styles from '../styles/Home.module.css';
import TaskComp from './Task';
import { Task as TaskType } from '../Types';

const TaskHandler: React.FC<{socket: Socket<DefaultEventsMap, DefaultEventsMap>, AuthCode: string}> = ({socket, AuthCode}) => {

    const [requestedTasks, setRequestedTasks] = useState<boolean>(false);

    const [activeTasks, setActiveTasks] = useState<Array<TaskType>>([]);

    useEffect(() => {
        socket.on('current-tasks', (Tasks: Array<TaskType>) => {
          setActiveTasks(Tasks);
        });
        return () => {
          socket.off('current-tasks');
        }
    }, [])

    useEffect(() => {
        console.log(AuthCode);
        if(AuthCode != null && requestedTasks === false) {
          socket.emit('get-tasks', AuthCode);
          setRequestedTasks(true);
        }
      })

    return (
        <div className={styles.todo}>
            {activeTasks.map((value, i) => {
                return <TaskComp Task={value} key={i}/>
            })}
        </div>
    )
}

export default TaskHandler;