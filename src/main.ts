import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
import { createFileRoute, createURLRoute } from 'electron-router-dom';
import 'reflect-metadata'
import { servicesFactory } from './factories/servicesFactory';
import { database } from './infra/database';

if (require('electron-squirrel-startup')) {
  app.quit();
}
const createWindow = () => {
  (globalThis as any).currentModalWindow = null;
  (globalThis as any).mainWindow = new BrowserWindow({
    title: 'Ordens de Serviço',
    minHeight: 750,
    minWidth: 1400,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const id = 'main'

  const devServerURL = createURLRoute(MAIN_WINDOW_VITE_DEV_SERVER_URL, id)

  const fileRoute = createFileRoute(
    path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    id
  )

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(devServerURL);
  } else {
    app.on('browser-window-focus', () => {
      globalShortcut.register('CommandOrControl+R', () => null)
      globalShortcut.register('F5', () => null)
    })
    mainWindow.loadFile(...fileRoute);
  }

  mainWindow.setMenuBarVisibility(false)

  mainWindow.once('ready-to-show', async () => {
    try {
      await database.initialize()
    } catch (e) {
      console.log((e as Error).message)
    }
    servicesFactory()
    mainWindow?.show()
    mainWindow?.maximize()
  });

};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

