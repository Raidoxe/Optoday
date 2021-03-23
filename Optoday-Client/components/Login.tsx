import styles from '../styles/Home.module.css';
import React, { useEffect } from 'react';

const Login: React.FC<{socket: any, setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}> = ({socket, setLoggedIn}) => {
    const [pass, setPass] = React.useState<string>('');

    const [errorMessage, setErrorMessage] = React.useState<string>(null);

    const onType = (event) => {
        console.log('Ontype')
        setPass(event.target.value);
    }

    const onEnter = () => {
        console.log('Sending auth: '+pass);
        socket.emit('auth', pass);
    }

    socket.on('auth-result', (data: boolean) => {
        console.log('Recieved auth result: '+data);
        if(data === true) {
            setLoggedIn(true);
        } else {
            setErrorMessage('Wrong password');
        }
    })

    useEffect(() => {
        console.log(socket.id);
    })

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginDiv}>
                <label className={styles.enterPassword}>Enter Password:</label>
                <input type="password" className={styles.passInput} onChange={onType}/>
                <button className={styles.Enter} onClick={onEnter}>Enter</button>
                <p className={styles.errorMessage}>{errorMessage}</p>
            </div>
            
        </div>
    )
}

export default Login;