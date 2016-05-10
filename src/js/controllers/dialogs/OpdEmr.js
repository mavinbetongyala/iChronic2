'use strict';
let moment = require('moment');

angular.module('app.controllers.dialogs.OpdEmr', ['app.services.Service'])
  .controller('OpdEmrCtrl', ($scope, $rootScope, $mdDialog, $log, ServiceService) => {
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $log.info($rootScope.items);

    let getServiceInfo = () => {
      ServiceService.getServiceInfo($rootScope.items.hospcode, $rootScope.items.pid, $rootScope.items.seq)
        .then(data => {
          if (data.ok) {
            //$log.info(data.rows)
            $scope.info = {};
            let _data = data.rows[0];
            $scope.info.fullname = `${_data.NAME} ${_data.LNAME}`;
            $scope.info.age = _data.AGE;
            $scope.info.birth = moment(_data.BIRTH).format('DD/MM/YYYY');
            $scope.info.service_hospital = _data.SERVICE_HOSPNAME;
            $scope.info.service_date = moment(_data.DATE_SERV).format('DD/MM/YYYY');
            $scope.info.service_time = moment(_data.TIME_SERV, 'hhmmss').format('hh:mm');
            $scope.info.instype_name = `${_data.INSTYPE_NAME} - ${_data.INSID}`;
            $scope.info.cc = _data.CHIEFCOMP;
          } else {
            $log.error(data.msg)
          }
        }, err => {
          $log.error(err)
        })
    };
    

    $scope.getServiceDiagnosisOpd = () => {
      
      ServiceService.getDiagnosisOpd($rootScope.items.hospcode, $rootScope.items.pid, $rootScope.items.seq)
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

    $scope.getServiceProcedureOpd = () => {
      
      ServiceService.getProcedureOpd($rootScope.items.hospcode, $rootScope.items.pid, $rootScope.items.seq)
        .then(data => {
          if (data.ok) {
            $scope.procedures = data.rows;
          } else {
            $log.error(data.msg)
          }
        }, err => {
          $log.error(err)
        })
    };

    $scope.getServiceDrugOpd = () => {
      
      ServiceService.getDrugOpd($rootScope.items.hospcode, $rootScope.items.pid, $rootScope.items.seq)
        .then(data => {
          if (data.ok) {
            $scope.drugs = data.rows;
          } else {
            $log.error(data.msg)
          }
        }, err => {
          $log.error(err)
        })
    };


    $scope.getServiceChargeOpd = () => {
      
      ServiceService.getChargeOpd($rootScope.items.hospcode, $rootScope.items.pid, $rootScope.items.seq)
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

    // initial service info
    getServiceInfo();
  });