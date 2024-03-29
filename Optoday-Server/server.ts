const io = require('socket.io')(5500);
const fs = require('fs');

const authcode = 'ABC123'

type Task = {
    name: string;
    importance: number;
    TTD: number;
    AI: string;
    Auth?: string;
}

type TaskFinish = {
    name: string;
    Auth: string;
}

type AuthResultData = {
    auth: string,
    result: boolean
}

const taskData = fs.readFileSync('tasks.json');

console.log('startup');

let currentTasks: Array<Task> = taskData != null ? JSON.parse(taskData) : [];

console.log('loadedtasks');

io.on('connection', (socket: any) => {
    socket.on('auth', (data: string) => {
        if (data === authcode) {
            socket.emit('auth-result', {auth: data, result: true});
        } else {
            socket.emit('auth-result', {auth: data, result: false});
        }
        
    });
    
    socket.on('upload-task', (data: Task) => {
        if(data.Auth === authcode) { 
            delete data.Auth;
            currentTasks.push(data);
            socket.emit('current-tasks', currentTasks);
        }
    });
    
    socket.on('finish-task', (data: TaskFinish) => {
        if(data.Auth === authcode) {
                currentTasks.forEach((Task: Task) => {
                    if(Task.name === data.name) {
                        const index = currentTasks.indexOf(Task);
                        if (index > -1) {
                            currentTasks.splice(index, 1);
                            socket.emit('task-finished', currentTasks);
                        }
                    }
                })
        }
    });
    socket.on('get-tasks', (Auth: string) => {
        if (Auth === authcode) {
            socket.emit('current-tasks', currentTasks);
        }
    })
});






const backupTasks = () => {
    fs.writeFile('tasks.json', JSON.stringify(currentTasks), function (err: any) {
        if(err) {
            console.error('Unable to backup tasks');
        } else {
            console.log('backed up tasks');
        }
    })
}

let taskBackupTimer =  setInterval(backupTasks, 180000);


//180000

