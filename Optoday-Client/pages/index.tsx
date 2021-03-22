import Head from 'next/head'
import styles from '../styles/Home.module.css'
import AddTask from '../components/AddTask';
import React from 'react';
import TaskComp from '../components/Task';
import { Task as TaskType } from '../Types';
import { io } from 'socket.io-client';
import Login from '../components/Login';

export default function Home() {

  const socket = io('http://localhost:5500', {transports: ['websocket', 'polling', 'flashsocket']});

  const [taskWindowState, setTaskWindowState] = React.useState<boolean>(false);

  const [isLoggedIn, setLoggedIn] = React.useState<boolean>(false);

  const setTaskState = () => {
    setTaskWindowState(true);
  }

  const Task: TaskType = {
    name: 'homework',
    importance: 2,
    TTD: 40,
    AI: 'Make sure to check connect for additional info'
  }
  return (
    <div>
      {isLoggedIn ? null : <Login socket={socket} setLoggedIn={setLoggedIn}/>}
      {taskWindowState ? <AddTask /> : null}
      <div className={taskWindowState ?  styles.PageBlur : isLoggedIn ? styles.Page : styles.pageLoginActive}>
        <div className={styles.PlusCircleHolder} onClick={setTaskState}>
          <object type='image/svg+xml' data='/plus-circle.svg' className={styles.add}/>
        </div>
        <div className={styles.todo}>
          <TaskComp Task={Task}/>
          <TaskComp Task={Task}/>
          <TaskComp Task={Task}/>
          <TaskComp Task={Task}/>
          <TaskComp Task={Task}/>
          <TaskComp Task={Task}/>
        </div>
      </div>
    </div>
  )
}
