const io = require('socket.io')(5500);
const fs = require('fs');

console.log('startup');

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

let currentTasks: Array<Task> = [];

io.on('connection', (socket: any) => {
    console.log('client connected: '+socket.id);
    socket.on('auth', (data: string) => {
        console.log('Recieved auth: '+data);
        if (data === authcode) {
            console.log('Data correct');
            socket.emit('auth-result', true);
        } else {
            socket.emit('auth-result', false);
        }
        
    });
    
    socket.on('upload-task', (data: Task) => {
        console.log('Task uploaded: '+data);
        if(data.Auth === authcode) { 
            console.log(1);
            delete data.Auth;
            currentTasks.push(data);
            console.log(currentTasks);
        }
    });
    
    socket.on('finish-task', (data: TaskFinish) => {
        if(data.Auth === authcode) { 
                currentTasks.forEach((Task: Task) => {
                    if(Task.name === data.name) {
                        const index = currentTasks.indexOf(Task);
                        if (index > -1) {
                            currentTasks.splice(index, 1);
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
    fs.writeFile('tasks.json', currentTasks.toString(), function (err: any) {
        if(err) {
            console.error('Unable to backup tasks');
        } else {
            console.log('backed up tasks');
        }
    })
}

let taskBackupTimer =  setInterval(backupTasks, 180000);




