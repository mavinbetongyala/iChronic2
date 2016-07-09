const { BrowserWindow} = require('electron').remote;
const focusedWindow = BrowserWindow.getFocusedWindow();

angular.module('app.controllers.Main', [])
  .controller('MainCtrl', ($scope, $mdSidenav) => {


    $scope.openDebug = () => {
      focusedWindow.webContents.toggleDevTools();
    };

    $scope.toggleLeft = () => {
      $mdSidenav('left').toggle();
    };

  })
