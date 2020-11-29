const electron = require('electron')
const { app, BrowserWindow, Menu, ipcMain } = electron
const platform = process.platform
let mainWindow
let addTodoWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  mainWindow.loadURL(`file://${__dirname}/main.html`)
  mainWindow.on('closed', () => app.quit())
  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

function createAddTodoWindow() {
  addTodoWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Add New Todo',
    webPreferences: {
      nodeIntegration: true,
    },
  })
  addTodoWindow.setMenuBarVisibility(false)
  addTodoWindow.loadURL(`file://${__dirname}/addTodo.html`)
  // garbage collecting
  addTodoWindow.on('closed', () => (addTodoWindow = null))
}
function handleClearTodos() {
  mainWindow.webContents.send('clearTodos', '')
}
ipcMain.on('newTodo', (event, todo) => {
  mainWindow.webContents.send('newTodo', todo)
  addTodoWindow.close()
})

const menuTemplate = [
  {
    label: 'Todos',
    submenu: [
      {
        label: 'New Todo',
        click() {
          createAddTodoWindow()
        },
      },
      {
        label: 'Clear Todos',
        accelerator: platform === 'darwin' ? 'Command+W' : 'Ctrl+W',
        click() {
          handleClearTodos()
        },
      },
      {
        label: 'Quit',
        accelerator: platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit()
        },
      },
    ],
  },
]
// check for mac-os and add the required empty obj in front
if (platform === 'darwin') {
  menuTemplate.unshift({})
}
if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'reload' },
      {
        label: 'Toggle developertools',
        accelerator: platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        },
      },
    ],
  })
}
