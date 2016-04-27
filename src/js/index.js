'use strict';
require('angular');
require('angular-ui-router');
require('angular-animate');
require('angular-aria');
require('angular-messages');
require('angular-material');
require('angular-material-data-table');

let Highcharts = require('highcharts');


require('./node_modules/highcharts-ng/dist/highcharts-ng.js');

angular.module('app', [
  'ngMaterial', 'ui.router', 'md.data.table', 'highcharts-ng',
  'app.config.Connection',
  'app.controlers.Main', 
  'app.controllers.App',
  'app.controlers.Emr'
])
  .run(() => {
    console.log('Welcome to angular.');
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
        url: '/emr',
        templateUrl: './templates/emr.html',
        controller: 'EmrCtrl'
      })

  })
  
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  })
  .controller('ToolbarCtrl', ($scope) => {
    $scope.close = () => {
      alert('Close')
    }
  });
