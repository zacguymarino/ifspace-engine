const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("IFS_API", {
  saveGame: (gameContent) => {
    ipcRenderer.send("saveGame", gameContent);
  },
  loadGame: async () => {
    return await ipcRenderer.invoke("loadGame");
  },
  createNode: async () => {
    return await ipcRenderer.invoke("createNode");
  },
  deleteNode: async () => {
    return await ipcRenderer.invoke("deleteNode");
  },
  getStyle: async () => {
    return await ipcRenderer.invoke("getStyle");
  },
  deleteDenied: () => {
    ipcRenderer.send("deleteDenied");
  }
});
