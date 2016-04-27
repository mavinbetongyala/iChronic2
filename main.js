'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

let mainWindow;
let prefsWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    frame: true,
    titleBarStyle: 'hidden',
    maximizable: false,
    resizable: false,
    center: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  //mainWindow.maximize();
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
    prefsWindow.destroy();
    prefsWindow = null;
  });

  prefsWindow = new BrowserWindow({
    width: 840,
    height: 630,
    show: false,
    resizable: false,
    center: true,
    frame: true
    // titleBarStyle: 'hidden',
    // skipTaskbar: false,
    // movable: false,
    // closable: true,
    // alwaysOnTop: true
  });

  prefsWindow.loadURL('file://' + __dirname + '/win2.html');

  ipcMain.on('toggle-prefs', () => {
    if (prefsWindow.isVisible())
      prefsWindow.hide();
    else
      prefsWindow.show()
  });


  prefsWindow.on('close', (event) => {
    event.preventDefault();
    prefsWindow.hide();
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q

});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
