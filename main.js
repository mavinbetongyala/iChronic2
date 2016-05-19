'use strict';

if (require('electron-squirrel-startup')) return;

/* global __dirname */

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipcMain = electron.ipcMain;

const fse = require('fs-extra');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    frame: false,
    titleBarStyle: 'hidden',
    maximizable: false,
    resizable: false,
    center: true,
    icon: './ico/calendar.png',
    title: 'iChronic 2'
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  //mainWindow.maximize();
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
    //prefsWindow.destroy();
    //prefsWindow = null;
  });


  ipcMain.on('exit-app', function(event, arg) {
    app.quit();
  });

  /*
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

  */

  let dataPath = app.getPath('appData');
  let appPath = path.join(dataPath, 'iChronic');
  let exportPath = path.join(appPath, 'exports');
  let configFile = path.join(appPath, 'config.json');

  fse.ensureDirSync(appPath);
  fse.ensureDirSync(exportPath);

  // fs.access(configFile, fs.W_OK && fs.R_OK, (err) => {
  //   if (err) {
  //     let defaultConfig = {
  //       hosxp: {
  //         host: '127.0.0.1',
  //         database: 'hos',
  //         port: 3306,
  //         user: 'sa',
  //         password: '123456'
  //       },

  //       url: 'http://localhost:3000',
  //       key: 'aaf891ddefffa0914b4d17e701cf5bd493ec2504'
  //     };

  //     fse.writeJsonSync(configFile, defaultConfig);

  //   }
  // });

}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
