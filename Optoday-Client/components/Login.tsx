import styles from '../styles/Home.module.css';
import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { AuthResultData } from '../Types';

const Login: React.FC<{socket: Socket<DefaultEventsMap, DefaultEventsMap>, setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>, setAuthCode: (auth: string) => void}> = ({socket, setLoggedIn, setAuthCode}) => {
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

    useEffect(() => {
        socket.on('auth-result', (data: AuthResultData) => {
            console.log('Recieved auth result: '+data.auth);
            if(data.result === true) {
                setAuthCode(data.auth);
                setLoggedIn(true);
            } else {
                setErrorMessage('Wrong password');
            }
        });
        return () => {
            socket.off('auth-result');
        }
    }, []);

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