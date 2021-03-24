import styles from "../styles/Home.module.css";
import React from 'react';
import { Task } from '../Types';

type TaskUpload = {
    name: string;
    importance: number;
    TTD: number;
    AI: string;
    Auth: string;
}

const AddTask: React.FC<{socket: any, setWindowState: React.Dispatch<React.SetStateAction<boolean>>, Auth: string}> = ({socket, setWindowState, Auth}) => {

    const [formState, setFormState] = React.useState<Task>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value
        });
    }

    const [errorMessage, setErrorMessage] = React.useState<string>(null);

    const onSubmit = () => {
        console.log('OnSubmit')
        if(formState != null) {
            console.log(0);
            if(formState.name != null && formState.importance <= 10 && formState.importance >= 1 && formState.TTD != null) {
                console.log(1);
                socket.emit('upload-task', {...formState, Auth: Auth});
                console.log(socket.id);
                setWindowState(false);
            } else {
                setErrorMessage('Entered data incorrect');
            }
    
        }
        
    }

    return (
        <div className={styles.centerDiv}>
            <div className={styles.addTaskSection}>
                <h2 className={styles.AddTaskText}>Add Task</h2>
                <input type="text" placeholder="Task name" className={styles.taskName} name="name" onChange={handleInputChange}/>
                <div className={styles.importanceDiv} >
                    <label className={styles.importanceDescription}>1 to 10:</label>
                    <input type="text" placeholder="Importance" className={styles.taskImportance} name="importance" onChange={handleInputChange}/>
                </div>
                <input type="text" placeholder="Time to do, minutes" className={styles.timeToDo} name="TTD" onChange={handleInputChange}/>
                <textarea placeholder="Additional Info" className={styles.additionalInfo} name="AI" onChange={handleInputChange}/>
                <button className={styles.done} onClick={onSubmit}>Done</button>
                <p className={styles.errorMessage}>{errorMessage}</p>
            </div>
        </div>
    )
}

export default AddTask;