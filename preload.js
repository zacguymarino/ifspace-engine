const {ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('IFS_API', {
    saveGame: (gameContent) => {
        ipcRenderer.send('saveGame', gameContent)
    },
    loadGame: async () => { 
        return await ipcRenderer.invoke('loadGame')
    },
});