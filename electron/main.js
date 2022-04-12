const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let loginWindow;

ipcMain.handle('getUserData', async (event, ...args) => {
            const result = app.getPath('userData');
            return result
        })

// Listen for app to be ready
app.on('ready', function () {

    ipcMain.on('CloseClick', () => CloseApp());
    ipcMain.on('MinClick', () => MinApp());
    ipcMain.on('OpenClick', () => OpenLoginForm());
    ipcMain.on('reloadMainWindow', () => mainWindow.reload());

    mainWindow = new BrowserWindow({
        icon:'./css/images/favicon120.png',
        width: 775,
        minWidth: 775,
        minHeight: 150,
        show: false,
        frame: false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.webContents.on('did-finish-load', function () {
        mainWindow.show();
    });

    mainWindow.removeMenu();
    //mainWindow.webContents.openDevTools();
});

function CloseApp() {

    mainWindow.close();

    try {
        if (loginWindow != null){
            loginWindow.close();
        }
    }
    catch (e) { }
}

function MinApp(){
    mainWindow.minimize();
}

function OpenLoginForm() {
    if (loginWindow != null){
        try {
            loginWindow.show();
        }
        catch {
            loginWindow = null;
            OpenLoginForm();
            return;
        }
    }
    else {

        ipcMain.on('LoginCloseClick', () => CloseLogin());
        ipcMain.on('LoginMinClick', () => MinLogin());
        loginWindow = new BrowserWindow({
            icon:'./css/images/favicon120.png',
            width: 545,
            height: 412,
            minWidth: 545,
            minHeight: 412,
            show: false,
            frame: false,
            webPreferences: {
                enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false,
            }
        });
        loginWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'loginForm.html'),
            protocol: 'file:',
            slashes: true
        }));
        loginWindow.webContents.on('did-finish-load', function () {
            loginWindow.show();
        });

        loginWindow.removeMenu();
        //loginWindow.webContents.openDevTools();
    }
}

function test() {
    ipcMain.send()
}

function CloseLogin() {
    loginWindow.close();
}

function MinLogin(){
    loginWindow.minimize();
}