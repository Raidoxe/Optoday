const io = require('socket.io')(5500);
const fs = require('fs');

console.log('startup');

type Task = {
    name: string;
    importance: number;
    TTD: number;
    AI: string;
}

let verifiedUsers: Array<any> = [];

let currentTasks: Array<Task> = [];

io.on('connection', (socket: any) => {
    console.log('client connected');
});

io.on('auth', (socket: any, data: string) => {
    if (data === 'ABC123') {
        verifiedUsers.push(socket);
    }
});

io.on('upload-task', (socket: any, data: Task) => {
    verifiedUsers.forEach((verifiedSocket) => {
        if(socket === verifiedSocket) { 
            currentTasks.push(data);
        }
    });
});

io.on('finish-task', (socket: any, taskName: string) => {
    verifiedUsers.forEach((verifiedSocket) => {
        if(socket === verifiedSocket) { 
            currentTasks.forEach((Task: Task) => {
                if(Task.name === taskName) {
                    const index = currentTasks.indexOf(Task);
                    if (index > -1) {
                        currentTasks.splice(index, 1);
                    }
                }
            })
        }
    });
});

const sendTasks = () => {
    verifiedUsers.forEach((socket) => {
        socket.emit(currentTasks);
    })
}

let taskUpdateTimer = setInterval(sendTasks, 3000);

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




