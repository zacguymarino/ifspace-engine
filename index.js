const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 1920,
    height: 1080,
  });
  //win.removeMenu();
  win.loadFile("if_create.html");
};

function handleFileOpen() {
  const filePaths = dialog.showOpenDialogSync();
  if (filePaths) {
    return fs.readFileSync(filePaths[0], "utf-8");
  }
}

function createNode() {
  var options = {
    type: 'question',
    buttons: ["Yes","Cancel"],
    cancelId: 1,
    message: 'Create a node at this location?'
  }
  return dialog.showMessageBoxSync(null,options);
}

function deleteNode() {
  var options = {
    type: 'question',
    buttons: ["Yes","Cancel"],
    cancelId: 1,
    message: 'Are you sure you want to delete the current node?'
  }
  return dialog.showMessageBoxSync(null,options);
}

async function deleteDenied() {
  var options = {
    type: 'error',
    buttons: ["Okay"],
    cancelId: 0,
    message: 'You cannot delete the origin node.'
  }
  return await dialog.showMessageBoxSync(null,options);
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on("saveGame", async (event, gameContent) => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    buttonLabel: "Save",
    filters: [
      {
        name: "JSON File",
        extensions: ["json"],
      },
    ],
  });

  if (filePath && !canceled) {
    fs.writeFile(filePath, gameContent, (err) => {
      if (err) throw err;
    });
  }
});

ipcMain.handle("loadGame", handleFileOpen);

ipcMain.handle("createNode", createNode);

ipcMain.handle("deleteNode", deleteNode);

ipcMain.on("deleteDenied", deleteDenied);
