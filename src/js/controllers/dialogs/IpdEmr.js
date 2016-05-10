'use strict';
let moment = require('moment');

angular.module('app.controllers.dialogs.IpdEmr', ['app.services.Service'])
  .controller('IpdEmrCtrl', ($scope, $rootScope, $mdDialog, $log, ServiceService) => {
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

     $log.info($rootScope.items);

    $scope.getServiceDiagnosisIpd = () => {
      
      ServiceService.getDiagnosisIpd($rootScope.items.hospcode, $rootScope.items.pid, $rootScope.items.an)
        .then(data => {
          if (data.ok) {
            $scope.diags = data.rows;
          } else {
            $log.error(data.msg)
          }
        }, err => {
          $log.error(err)
        })
    };

    $scope.getServiceProcedureIpd = () => {
      
      ServiceService.getProcedureIpd($rootScope.items.hospcode, $rootScope.items.pid, $rootScope.items.an)
        .then(data => {
          if (data.ok) {
            // $scope.procedures = data.rows;
            $scope.procedures = [];
            $log.info(data.rows);
            data.rows.forEach(v => {
              let obj = {};
              obj.PROCEDCODE = v.PROCEDCODE;
              obj.PROCEDNAME = v.PROCEDNAME;
              obj.TIMESTART = moment(v.TIMESTART, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY hh:mm');
              obj.TIMEFINISH = moment(v.TIMEFINISH, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY hh:mm');
              $scope.procedures.push(obj);
            })
          } else {
            $log.error(data.msg)
          }
        }, err => {
          $log.error(err)
        })
    };

    $scope.getServiceDrugIpd = () => {
      
      ServiceService.getDrugIpd($rootScope.items.hospcode, $rootScope.items.pid, $rootScope.items.an)
        .then(data => {
          if (data.ok) {
            $scope.drugs = [];
            data.rows.forEach(v => {
              let obj = {};
              obj.DNAME = v.DNAME;
              obj.AMOUNT = v.AMOUNT;
              obj.UNIT_NAME = v.UNIT_NAME;
              obj.DATESTART = moment(v.DATESTART, 'YYYY-MM-DD').format('DD/MM/YYYY');
              obj.DATEFINISH = moment(v.DATEFINISH, 'YYYY-MM-DD').format('DD/MM/YYYY');
              $scope.drugs.push(obj);
            })
          } else {
            $log.error(data.msg)
          }
        }, err => {
          $log.error(err)
        })
    };


    $scope.getServiceChargeIpd = () => {
      
      ServiceService.getChargeIpd($rootScope.items.hospcode, $rootScope.items.pid, $rootScope.items.an)
        .then(data => {
          if (data.ok) {
            $scope.charges = data.rows;
          } else {
            $log.error(data.msg)
          }
        }, err => {
          $log.error(err)
        })
    };

  });