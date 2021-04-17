import { FC, useEffect, useState} from 'react';
import { Task as TaskType } from '../Types';
import styles from '../styles/Task.module.css';
import Animator from 'react-lottie';
import checkAnimationData from '../public/check-animation.json';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

type TaskFinish = {
    name: string;
    Auth: string;
}

const Task: FC<{Task: TaskType, socket: Socket<DefaultEventsMap, DefaultEventsMap>, AuthCode: string}> = ({Task, socket, AuthCode}) => {

    const [checkAnim, setCheckAnim] = useState<boolean>(false);

    const animationOptions = {
        loop: false,
        autoplay: true,
        animationData: checkAnimationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const taskFinished = () => {
        setCheckAnim(true);
        console.log(Task);
        setTimeout(() => {
            socket.emit('finish-task', { name: Task.name, Auth: AuthCode});
            setCheckAnim(false);
    }, 2000)
        
    }

    return (
        <div className={styles.Task}>
            <h2 className={styles.name}>{Task.name}</h2>
            <p className={styles.importance}>Importance: {Task.importance}</p>
            <p className={styles.TTD}>Time to do: {Task.TTD}</p>
            <p className={styles.AI}>{Task.AI}</p>
            <div className={styles.check} onClick={taskFinished}>
                {checkAnim ? 
                <Animator options={animationOptions} height={60} width={60}/>
                :
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={styles.checkSvg} viewBox="0 0 16 16">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                </svg>
                }
            </div>
            
        </div>
    );
}

export default Task;