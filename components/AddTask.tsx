import styles from "../styles/Home.module.css";
import React from 'react';
import { Task } from '../Types';


export default function AddTask()  {

    const [formState, setFormState] = React.useState<Task>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value
        });
    }

    const onSubmit = () => {
        //send to server
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
            </div>
        </div>
    )
}