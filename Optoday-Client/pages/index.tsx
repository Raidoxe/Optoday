import Head from 'next/head'
import styles from '../styles/Home.module.css'
import AddTask from '../components/AddTask';
import React, { useEffect } from 'react';
import TaskComp from '../components/Task';
import { Task as TaskType } from '../Types';
import { io, Socket } from 'socket.io-client';
import Login from '../components/Login';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io('http://localhost:5500', {transports: ['websocket', 'polling', 'flashsocket']});

export default function Home() {

  const Task: TaskType = {
    name: 'homework',
    importance: 2,
    TTD: 40,
    AI: 'Make sure to check connect for additional info'
  }
  
  const [AuthCode, setAuthCode] = React.useState<string>(null);

  const [taskWindowState, setTaskWindowState] = React.useState<boolean>(false);

  const [isLoggedIn, setLoggedIn] = React.useState<boolean>(false);

  const [requestedTasks, setRequestedTasks] = React.useState<boolean>(false);

  const setTaskState = () => {
    setTaskWindowState(true);
  }

  const [activeTasks, setActiveTasks] = React.useState<Array<TaskType>>([]);

  const setAuth = (auth: string) => {
    setAuthCode('ABC123');
  }

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
    <div>
      {isLoggedIn ? null : <Login socket={socket} setLoggedIn={setLoggedIn} setAuthCode={setAuth}/>}
      {taskWindowState ? <AddTask socket={socket} setWindowState={setTaskWindowState} Auth={AuthCode}/> : null}
      <div className={taskWindowState ?  styles.PageBlur : isLoggedIn ? styles.Page : styles.pageLoginActive}>
        <div className={styles.PlusCircleHolder} onClick={setTaskState}>
          <object type='image/svg+xml' data='/plus-circle.svg' className={styles.add}/>
        </div>
        <div className={styles.todo}>
          {activeTasks.map((value, i) => {
            return <TaskComp Task={value} key={i}/>
          })}
        </div>
      </div>
    </div>
  )
}
