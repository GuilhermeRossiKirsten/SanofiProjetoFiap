const { app, BrowserWindow, Menu } = require("electron");
Menu.setApplicationMenu(false);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 1000,
    icon: "./assets/images/hard-disk.png",
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});
