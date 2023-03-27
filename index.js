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
  win.removeMenu();
  win.loadFile("if_create.html");
};

function handleFileOpen() {
  const filePaths = dialog.showOpenDialogSync();
  if (filePaths) {
    return fs.readFileSync(filePaths[0], "utf-8");
  }
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
