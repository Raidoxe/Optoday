import Head from 'next/head'
import styles from '../styles/Home.module.css'
import AddTask from '../components/AddTask';
import React, { useEffect } from 'react';
import TaskComp from '../components/Task';
import { Task as TaskType } from '../Types';
import { io, Socket } from 'socket.io-client';
import Login from '../components/Login';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

export default function Home() {

  const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io('http://localhost:5500', {transports: ['websocket', 'polling', 'flashsocket']});

  const [taskWindowState, setTaskWindowState] = React.useState<boolean>(false);

  const [isLoggedIn, setLoggedIn] = React.useState<boolean>(false);

  const [AuthCode, setAuthCode] = React.useState<string>('');

  const setTaskState = () => {
    setTaskWindowState(true);
  }

  const Task: TaskType = {
    name: 'homework',
    importance: 2,
    TTD: 40,
    AI: 'Make sure to check connect for additional info'
  }

  const [activeTasks, setActiveTasks] = React.useState<Array<TaskType>>([]);

  const requestTasks = () => {
    socket.emit('get-tasks', AuthCode);
    console.log(activeTasks);
  }

  socket.on('current-tasks', (Tasks: Array<TaskType>) => {
    setActiveTasks(Tasks);
  })

  let requestTaskTimer =  setInterval(requestTasks, 2000);

  useEffect(() => {
    return () => {
      socket.off('current-tasks');
      clearInterval(requestTaskTimer);
    }
  }, [])

  return (
    <div>
      {isLoggedIn ? null : <Login socket={socket} setLoggedIn={setLoggedIn} setAuthCode={setAuthCode}/>}
      {taskWindowState ? <AddTask socket={socket} setWindowState={setTaskWindowState} Auth={AuthCode}/> : null}
      <div className={taskWindowState ?  styles.PageBlur : isLoggedIn ? styles.Page : styles.pageLoginActive}>
        <div className={styles.PlusCircleHolder} onClick={setTaskState}>
          <object type='image/svg+xml' data='/plus-circle.svg' className={styles.add}/>
        </div>
        <div className={styles.todo}>
          {activeTasks.map((value) => {
            return <TaskComp Task={value}/>
          })}
        </div>
      </div>
    </div>
  )
}
