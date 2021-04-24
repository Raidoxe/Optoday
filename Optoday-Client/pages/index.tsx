import Head from 'next/head'
import styles from '../styles/Home.module.css'
import AddTask from '../components/AddTask';
import React, { useEffect } from 'react';
import TaskComp from '../components/Task';
import { Task as TaskType } from '../Types';
import { io, Socket } from 'socket.io-client';
import Login from '../components/Login';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import TaskHandler from '../components/TaskHandler';

const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io('http://oliverhuth.ddns.net:5500', {transports: ['websocket', 'polling', 'flashsocket']});

export default function Home() {
  const [AuthCode, setAuthCode] = React.useState<string>(null);

  const [taskWindowState, setTaskWindowState] = React.useState<boolean>(false);

  const [isLoggedIn, setLoggedIn] = React.useState<boolean>(false);

  const setTaskState = () => {
    setTaskWindowState(true);
  }

  const setAuth = (auth: string) => {
    console.log('Auth: '+auth);
    setAuthCode(auth);
  }

  return (
    <div>
      {isLoggedIn ? null : <Login socket={socket} setLoggedIn={setLoggedIn} setAuthCode={setAuth}/>}
      {taskWindowState ? <AddTask socket={socket} setWindowState={setTaskWindowState} Auth={AuthCode}/> : null}
      <div className={taskWindowState ?  styles.PageBlur : isLoggedIn ? styles.Page : styles.pageLoginActive}>
        <div className={styles.PlusCircleHolder} onClick={setTaskState}>
          <object type='image/svg+xml' data='/plus-circle.svg' className={styles.add}/>
        </div>
        <TaskHandler socket={socket} AuthCode={AuthCode}/>
      </div>
    </div>
  )
}
