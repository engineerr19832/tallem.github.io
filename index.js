const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    });

    win.loadURL('data:text/html;charset=utf-8,<html><body><h1>Test Window</h1></body></html>');
}

app.whenReady().then(createWindow);
app.on('ready', () => console.log('App is ready'));
app.on('window-all-closed', () => console.log('All windows closed'));
app.on('activate', () => console.log('App activated'));
app.on('error', (err) => console.error('App Error:', err));

