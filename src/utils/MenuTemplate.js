export var template = [
  {
    label: '文件(F)',
    submenu: [
      {
        label: '新建文件',
        accelerator: 'CmdOrCtrl+N',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('createNewFile')
        }
      },
      {
        label: '保存文件',
        accelerator: 'CmdOrCtrl+S',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('saveFile')
        }
      },
      {
        label: '打开文件',
        accelerator: 'CmdOrCtrl+O',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('openFile')
        }
      }
    ]
  },
  {
    label: '编辑(E)',
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('undo')
        }
      },
      {
        label: '恢复',
        accelerator: 'CmdOrCtrl+Y',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('redo')
        }
      },
      {
        type: 'separator'
      },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('cut')
        }
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('copy')
        }
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('paste')
        }
      }
    ]
  },
  {
    label: '选择(Z)',
    submenu: [
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('selectAll')
        }
      },
      {
        label: '反选',
        accelerator: 'CmdOrCtrl+E',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('selectInvert')
        }
      }
    ]
  }
]
