/* global angular */

'use strict';

require('angular');
require('angular-ui-router');
require('angular-animate');
require('angular-aria');
require('angular-messages');
require('angular-material');
require('angular-material-data-table');

const Highcharts = require('highcharts');
const { BrowserWindow, ipcRenderer, dialog } = require('electron').remote;
const focusedWindow = BrowserWindow.getFocusedWindow();

require('highcharts/themes/grid');
require('./node_modules/highcharts-ng/dist/highcharts-ng.js');

angular.module('app', [
  'ngMaterial', 'ui.router', 'md.data.table', 'highcharts-ng',
  'app.config.Connection',
  'app.controllers.Main',
  'app.controllers.App',
  'app.controllers.Emr'
])
  .run(($log) => {
    $log.info('Welcome to angular.');
  })
  .config(($urlRouterProvider, $stateProvider, $mdThemingProvider) => {

    $mdThemingProvider.theme('default')
      .primaryPalette('pink', {
        'default': '500', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
      })
      // If you specify less than all of the keys, it will inherit from the
      // default shades
      .accentPalette('orange', {
        'default': '200' // use shade 200 for default, and keep all other shades the same
      });

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: './templates/main.html',
        controller: 'MainCtrl'
      })
      .state('emr', {
        url: '/emr/:cid',
        templateUrl: './templates/emr.html',
        controller: 'EmrCtrl'
      });

  })

  .controller('ToolbarCtrl', ($scope, $log, $mdDialog) => {
    $scope.exitApp = () => {
      var confirm = $mdDialog.confirm()
            .title('Confirmation')
            .textContent('คุณต้องการออกจากโปรแกรมใช่หรือไม่?')
            .ariaLabel('Confirm')
            .ok('ใช่, ออกจากโปรแกรม')
            .cancel('ไม่ใช่');
      $mdDialog.show(confirm).then(function() {
        ipcRenderer.sendSync('exit-app');
      }, function() {
        //
      });

    };

    $scope.openDebug = () => {
      focusedWindow.webContents.toggleDevTools();
    };

    $scope.minimize = () => {
      focusedWindow.minimize();
    };

  });
