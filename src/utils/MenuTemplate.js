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
      },
      {
        type: 'separator'
      },
      {
        label: '顺时针旋转90度',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('rotate', 90)
        }
      },
      {
        label: '顺时针旋转180度',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('rotate', 180)
        }
      },
      {
        label: '逆时针旋转90度',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('rotate', -90)
        }
      },
      {
        label: '逆时针旋转180度',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('rotate', -180)
        }
      },
      {
        type: 'separator'
      },
      {
        label: '水平翻转',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('flipX')
        }
      },
      {
        label: '垂直翻转',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('flipY')
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
  },
  {
    label: '排序(Z)',
    submenu: [
      {
        label: '左对齐',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('justify', 'left')
        }
      },
      {
        label: '右对齐',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('justify', 'right')
        }
      },
      {
        label: '上对齐',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('justify', 'top')
        }
      },
      {
        label: '下对齐',
        click: function (menuItem, window, event) {
          let webContents = window.webContents
          webContents.send('justify', 'bottom')
        }
      }
    ]
  }
]
