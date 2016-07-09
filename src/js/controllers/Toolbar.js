const { BrowserWindow} = require('electron').remote;
const focusedWindow = BrowserWindow.getFocusedWindow();


angular.module('app.controllers.Toolbar', [])
  .controller('ToolbarCtrl', ($scope, $state, $mdDialog, $mdSidenav) => {


    $scope.go = (state) => {
      $state.go(state);
    };

    $scope.openDebug = () => {
      focusedWindow.webContents.toggleDevTools();
    };

    $scope.toggleLeft = () => {
      $mdSidenav('left').toggle();
    };

    $scope.exportData = (ev) => {
      $mdDialog.show({
        controller: 'ExportSmokingCtrl',
        templateUrl: './templates/dialogs/export-data.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      });
    }

    $scope.connectionSetting = (ev) => {
      $mdDialog.show({
        controller: 'ConnectionCtrl',
        templateUrl: './templates/dialogs/connection.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      });
    }


    $scope.exitApp = () => {
      var confirm = $mdDialog.confirm()
        .title('Confirmation')
        .textContent('คุณต้องการออกจากโปรแกรมใช่หรือไม่?')
        .ariaLabel('Confirm')
        .ok('ใช่, ออกจากโปรแกรม')
        .cancel('ไม่ใช่');
      $mdDialog.show(confirm).then(function () {
        ipcRenderer.sendSync('exit-app');
      }, function () {
        //user cancel
      });

    };

    $scope.openDebug = () => {
      focusedWindow.webContents.toggleDevTools();
    };

    $scope.minimize = () => {
      focusedWindow.minimize();
    };


  });