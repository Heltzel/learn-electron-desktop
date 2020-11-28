const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron

let mainWindow
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
})
ipcMain.on('file-path', (event, fileObj) => {
  mainWindow.webContents.send('file-path', fileObj)
})
