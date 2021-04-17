import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import styles from '../styles/Home.module.css';
import TaskComp from './Task';
import { Task as TaskType } from '../Types';

const TaskHandler: React.FC<{socket: Socket<DefaultEventsMap, DefaultEventsMap>, AuthCode: string}> = ({socket, AuthCode}) => {

    const [requestedTasks, setRequestedTasks] = useState<boolean>(false);

    const [activeTasks, setActiveTasks] = useState<Array<TaskType>>([]);

    //divide time by importance

    const setTasks = (Tasks: Array<TaskType>) => {
      //bubble sort
      let checked: boolean = true;
      do {
        checked = false;
        for(let i = 0; i < Tasks.length; i++) {
          if(Tasks[i+1] != undefined) {
            const el1 = Tasks[i].TTD / Tasks[i].importance;
            const el2 = Tasks[i+1].TTD / Tasks[i+1].importance;
            if(el1 > el2) {
              let tmp = Tasks[i];
              Tasks[i] = Tasks[i+1];
              Tasks[i+1] = tmp;
              checked = true;
            }
          }
        }
      } while (checked === true)
      setActiveTasks(Tasks);
    }

    useEffect(() => {
        socket.on('current-tasks', (Tasks: Array<TaskType>) => {
          setTasks(Tasks);
        });
        socket.on('task-finished', (tasks: Array<TaskType>) => {
          setTasks(tasks);
        });
        return () => {
          socket.off('current-tasks');
          socket.off('task-finished');
        }
    }, [])

    useEffect(() => {
        console.log(AuthCode);
        if(AuthCode != null && requestedTasks === false) {
          setRequestedTasks(true);
          socket.emit('get-tasks', AuthCode);
        }
      })

    return (
        <div className={styles.todo}>
            {activeTasks.map((value, i) => {
                return <TaskComp Task={value} key={i} socket={socket} AuthCode={AuthCode}/>
            })}
        </div>
    )
}

export default TaskHandler;