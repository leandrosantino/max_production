import { contextBridge } from 'electron';
import { ipcRenderer } from "electron"


const preloadMethods = {
  invoke: ipcRenderer.invoke,
  on: ipcRenderer.on
}

export type PreloadMethods = typeof preloadMethods

contextBridge.exposeInMainWorld('app', preloadMethods);
