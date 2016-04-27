'use strict';

let ipcRenderer = require('electron').ipcRenderer;

angular.module('app.controlers.Emr', [])
  .controller('EmrCtrl', ($scope, $state) => {

    $scope.goHome = () => {
      $state.go('main');
      //ipcRenderer.send('toggle-prefs');
    };

    $scope.openMenu = function($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };

    $scope.chartConfig = {
      options: {
        chart: {
          type: 'line'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        crosshair: true
      },
      series: [{
        name: 'Tokyo',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
      }],
      title: {
        text: 'ประวัติการวัดความดันโลหิต'
      },

      loading: false
    };

 
  })
