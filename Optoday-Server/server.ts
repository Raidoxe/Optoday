const io = require('socket.io')(5500);
const fs = require('fs');

console.log('startup');

type Task = {
    name: string;
    importance: number;
    TTD: number;
    AI: string;
}

let verifiedUsers: Array<string> = [];

let currentTasks: Array<Task> = [];

io.on('connection', (socket: any) => {
    console.log('client connected: '+socket.id);
    socket.on('auth', (data: string) => {
        console.log('Recieved auth: '+data);
        if (data === 'ABC123') {
            console.log('Data correct');
            verifiedUsers.push(socket.id);
            socket.emit('auth-result', true);
        } else {
            socket.emit('auth-result', false);
        }
        
    });
    
    socket.on('upload-task', (data: Task) => {
        console.log('Task uploaded: '+data);
        console.log(verifiedUsers);
        verifiedUsers.forEach((verifiedSocket) => {
            console.log(0);
            console.log('socket id is: '+socket.id);
            console.log('verified id is: '+verifiedSocket.id);
            if(socket.id === verifiedSocket.id) { 
                console.log(1);
                currentTasks.push(data);
            }
        });
    });
    
    socket.on('finish-task', (taskName: string) => {
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




