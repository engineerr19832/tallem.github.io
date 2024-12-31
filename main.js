const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    });
    win.loadURL('data:text/html;charset=utf-8,<h1>Hello, Electron!</h1>');
});
