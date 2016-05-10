'use strict';

angular.module('app.controllers.dialogs.LabFu', ['app.services.LabFu'])
  .controller('LabFuCtrl', ($scope, $rootScope, $mdDialog, $log, LabFuService) => {
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.getLabResult = () => {

      LabFuService.getList($rootScope.items.hospcode, $rootScope.items.pid, $rootScope.items.seq)
        .then(data => {
          if (data.ok) {
            $scope.labs = data.rows;
          } else {
            $log.error(data.msg)
          }
        }, err => {
          $log.error(err)
        })
    };
    
    $scope.getLabResult();
    
  });