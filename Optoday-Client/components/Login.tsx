import styles from '../styles/Home.module.css';
import React from 'react';

const Login: React.FC<{socket: any, setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}> = ({socket, setLoggedIn}) => {
    const [pass, setPass] = React.useState<string>('');

    const [errorMessage, setErrorMessage] = React.useState<string>(null);

    const onType = (event) => {
        setPass(event.target.value);
    }

    const onEnter = () => {
        socket.emit('auth', pass);
    }

    socket.on('auth-result', (data: boolean) => {
        if(data === true) {
            setLoggedIn(true);
        } else {
            setErrorMessage('Wrong password');
        }
    })

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginDiv}>
                <label className={styles.enterPassword}>Enter Password:</label>
                <input type="password" className={styles.passInput} onChange={onType}/>
                <button className={styles.Enter} onSubmit={onEnter}>Enter</button>
            </div>
            <p className={styles.errorMessage}>{errorMessage}</p>
        </div>
    )
}

export default Login;