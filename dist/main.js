"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
let mainWindow;
const debug = /--debug/.test(process.argv[2]);
if (process.mas) {
    electron_1.app.setName('Komodo BIS HST-UI');
}
/**
 *
 */
function initialize() {
    makeSingleInstance();
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    electron_1.app.on('ready', createWindow);
    // app.whenReady(()=>{
    //  app.allowRendererProcessReuse=false;
    // });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', () => {
        // On OS X it"s common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow();
        }
    });
}
/**
 *
 */
function createWindow() {
    electron_1.app.allowRendererProcessReuse = false;
    // Create the browser window.
    const windowOptions = {
        height: 780,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
        title: electron_1.app.getName(),
        width: 900,
        autoHideMenuBar: true,
    };
    if (process.platform === 'linux') {
        windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/dna.png');
    }
    mainWindow = new electron_1.BrowserWindow(windowOptions);
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../html/index.html'));
    if (debug) {
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
        mainWindow.maximize();
        require('devtron').intall();
    }
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}
/**
 *
 */
function makeSingleInstance() {
    if (process.mas)
        return;
    electron_1.app.requestSingleInstanceLock();
    electron_1.app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
    });
}
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
initialize();
//# sourceMappingURL=main.js.map