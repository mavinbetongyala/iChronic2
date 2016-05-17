'use strict';

/* global angular */

let ipcRenderer = require('electron').ipcRenderer;
let _ = require('lodash');
let moment = require('moment');

angular.module('app.controllers.Emr', [
  'app.services.LabFu',
  'app.services.ChronicFu',
  'app.services.Service',
  'app.services.Admission',
  'app.services.CommunityService',
  'app.controllers.dialogs.OpdEmr',
  'app.controllers.dialogs.IpdEmr',
  'app.controllers.dialogs.LabFu',
  'app.services.Calculator',
  'app.cotrollers.dialogs.DrugAllergy'
])
  .controller('EmrCtrl', ($scope, $state, $log, $stateParams, $mdDialog, $rootScope,
                          LabFuService, PersonService, AdmissionService, CalculatorService,
                          ChronicFuService, ServiceService, CommunityService, Connection) => {

    let db = Connection.getHISConnection();

    $scope.cid = $stateParams.cid;
    // $log.info($stateParams);

    $scope.goHome = () => {
      $state.go('main');
      //ipcRenderer.send('toggle-prefs');
    };

    $scope.openMenu = function($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
    };

    $scope.chartConfigFBS = {
      options: {
        chart: {
          type: 'line',
          width: 670
        },

        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            },
            enableMouseTracking: true
          }
        }
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      xAxis: {
        categories: [],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'mg/dL'
        },
        plotLines: [{
          value: 109,
          color: 'red',
          width: 1,
          label: {
            text: 'ค่ามาตรฐานไม่เกิน: 110',
            align: 'center',
            style: {
              color: 'gray'
            }
          }
        }]
      },

      series: [{
        name: 'FBS',
        data: []
      }],
      title: {
        text: 'FBS'
      },

      loading: false
    };

    $scope.chartConfigBP = {
      options: {
        chart: {
          type: 'line',
          width: 670
        },

        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            },
            enableMouseTracking: true
          }
        }
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      xAxis: {
        categories: [],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'mg/dL'
        },
        plotLines: [{
          value: 139,
          color: 'red',
          width: 1,
          label: {
            text: 'ค่ามาตรฐาน SBP ไม่เกิน: 140',
            align: 'center',
            style: {
              color: 'gray'
            }
          }
        },
          {
            value: 89,
            color: 'blue',
            width: 1,
            label: {
              text: 'ค่ามาตรฐาน DBP ไม่เกิน: 90',
              align: 'center',
              style: {
                color: 'gray'
              }
            }
          }]
      },
      series: [
        {
          name: 'SBP',
          data: []
        },
        {
          name: 'DBP',
          data: []
        }
      ],
      title: {
        text: 'ความดันโลหิต'
      },

      loading: false
    };

    $scope.chartConfigGFR = {
      options: {
        chart: {
          type: 'line',
          width: 670
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      xAxis: {
        categories: [],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'STAGE'
        }
      },
      series: [{
        name: 'STAGE',
        data: []
      }],
      title: {
        text: 'eGFR (CKD-EPI)'
      },

      loading: false
    };

    $scope.chartConfigTC = {
      options: {
        chart: {
          type: 'line',
          width: 670
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      xAxis: {
        categories: [],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'mg/dL'
        }
      },
      series: [{
        name: 'ผลตรวจ',
        data: []
      }],
      title: {
        text: 'Cholesterol'
      },

      loading: false
    };

    $scope.fillname = null;
    $scope.sex = null;
    $scope.age = null;
    $scope.hn = null;
    $scope.smoking = null;
    $scope.isDm = false;

    // Show loading
    $scope.showLoading = true;

    // Get person info
    PersonService.getInfo(db, $scope.cid)
      .then(rows => {
        // $log.info(rows)
        $scope.fullname = `${rows.pname}${rows.fname} ${rows.lname}`;
        $scope.age = rows.age;
        $scope.sex = rows.sex;
        $scope.hn = rows.patient_hn;

        return PersonService.getSmoking(db, $scope.hn);
      })
      .then(smoking => {
        $scope.smoking = smoking ? smoking : 0;
        return LabFuService.getLabResult($scope.cid, '03');
      })
      .then(data => {
        let labs = _.sortBy(data.rows, (obj) => { return obj.DATE_SERV; });
        _.forEach(labs, v => {
          let service_date = moment(v.DATE_SERV).format('DD/MM/YYYY');
          $scope.chartConfigFBS.xAxis.categories.push(service_date);
          $scope.chartConfigFBS.series[0].data.push(v.LABRESULT);
        });

        return ChronicFuService.getFu($scope.cid);
      })
      .then(data => {
        $scope.chronicfu = [];
        _.forEach(data.rows, v => {
          let obj = {};
          obj.date = moment(v.DATE_SERV).format('DD/MM/YYYY');
          obj.hospcode = v.HOSPCODE;
          obj.hospital = `${v.HOSPCODE} - ${v.HOSPNAME}`;
          obj.pid = v.PID;
          obj.retina = v.RETINA_NAME;
          obj.foot = v.FOOT_NAME;
          $scope.chronicfu.push(obj);
        });

        let chronicfus = _.sortBy(data.rows, (obj) => { return obj.DATE_SERV; });
        //$log.info(chronicfus);
        _.forEach(chronicfus, v => {
          if (v.SBP && v.DBP) {
            let service_date = moment(v.DATE_SERV).format('DD/MM/YYYY');
            $scope.chartConfigBP.xAxis.categories.push(service_date);
            $scope.chartConfigBP.series[0].data.push(v.SBP);
            $scope.chartConfigBP.series[1].data.push(v.DBP);
          }
        });

        return LabFuService.getLabResult($scope.cid, '07');
      })
      .then(data => {
        let labs = _.sortBy(data.rows, (obj) => { return obj.DATE_SERV; });
        _.forEach(labs, v => {
          let service_date = moment(v.DATE_SERV).format('DD/MM/YYYY');
          $scope.chartConfigTC.xAxis.categories.push(service_date);
          $scope.chartConfigTC.series[0].data.push(v.LABRESULT);
        });

        return LabFuService.getCreatinine($scope.cid);
      })
      .then(data => {
        //$log.info(data.rows);
        $scope.creatinies = [];
        let _creatinies = _.sortBy(data.rows, (obj) => { return obj.DATE_SERV; });

        _.forEach(_creatinies, v => {
          let service_date = moment(v.DATE_SERV).format('DD/MM/YYYY');
          let stage = CalculatorService.egfr(v.LABRESULT, $scope.sex, $scope.age);
          $scope.chartConfigGFR.xAxis.categories.push(service_date);
          $scope.chartConfigGFR.series[0].data.push(stage);
        });

      // Hide loading
      $scope.showLoading = false;

      }, err => {
        // Hide loading
        $scope.showLoading = false;
        $log.error(err)
      });

    $scope.getOpdService = () => {
      // Show loading
      $scope.showLoading = true;
      $scope.services = [];

      ServiceService.getServices($scope.cid)
        .then(data => {
          // $log.info(rows)

          if (data.ok) {
            _.forEach(data.rows, v => {
              let obj = {};
              obj.pid = v.PID;
              obj.seq = v.SEQ;
              obj.hospcode = v.HOSPCODE;
              obj.hospital = `${v.HOSPCODE} - ${v.HOSPNAME}`;
              obj.date = moment(v.DATE_SERV).format('DD/MM/YYYY');
              obj.time = moment(v.TIME_SERV, 'HHmmss').format('HH:mm');
              obj.instype = v.INSTYPE_NAME;
              $scope.services.push(obj);
            });

            $scope.showLoading = false;
          } else {
            $scope.showLoading = false;
            $log.error(data.msg)
          }
        }, err => {
          $scope.showLoading = false;
          $log.error(err)
        })
    };

    $scope.getIpdService = () => {
      $scope.showLoading = true;
      $scope.admission = [];

      AdmissionService.getAdmission($scope.cid)
        .then(data => {
          // $log.info(rows)

          if (data.ok) {
            _.forEach(data.rows, v => {
              let obj = {};
              obj.pid = v.PID;
              obj.an = v.AN;
              obj.hospcode = v.HOSPCODE;
              obj.hospital = `${v.HOSPCODE} - ${v.HOSPNAME}`;
              obj.date = moment(v.DATETIME_ADMIT, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
              obj.time = moment(v.DATETIME_ADMIT, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');
              obj.instype = v.INSTYPE_NAME;
              obj.dischtype_name = v.DISCHTYPE_NAME;
              $scope.admission.push(obj);
            });

            $scope.showLoading = false;
          } else {
            $scope.showLoading = false;
            $log.error(data.msg)
          }
        }, err => {
          $scope.showLoading = false;
          $log.error(err)
        })
    };

    $scope.getLab = () => {
      $scope.showLoading = true;
      $scope.labs = [];
      LabFuService.getService($scope.cid)
        .then(data => {
          // $log.info(rows)

          if (data.ok) {
            _.forEach(data.rows, v => {
              let obj = {};
              obj.pid = v.PID;
              obj.seq = v.SEQ;
              obj.hospcode = v.HOSPCODE;
              obj.hospital = `${v.HOSPCODE} - ${v.HOSPNAME}`;
              obj.date = moment(v.DATE_SERV, 'YYYY-MM-DD').format('DD/MM/YYYY');
              $scope.labs.push(obj);
            });

            $scope.showLoading = false;
          } else {
            $scope.showLoading = false;
            $log.error(data.msg)
          }
        }, err => {
          $scope.showLoading = false;
          $log.error(err)
        })
    };

    $scope.getCommunityService = () => {

      $scope.showLoading = true;
      $scope.community_services = [];

      CommunityService.getService($scope.cid)
        .then(data => {
          if (data.ok) {
            _.forEach(data.rows, v => {
              let obj = {};
              obj.pid = v.PID;
              obj.hospcode = v.HOSPCODE;
              obj.hospital = `${v.HOSPCODE} - ${v.HOSPNAME}`;
              obj.date = moment(v.DATE_SERV, 'YYYY-MM-DD').format('DD/MM/YYYY');
              obj.comservice = v.COMSERVICE_NAME;
              $scope.community_services.push(obj);
            });

            $scope.showLoading = false;
          } else {
            $scope.showLoading = false;
            $log.error(data.msg)
          }
        }, err => {
          $scope.showLoading = false;
          $log.error(err)
        })
    };

    $scope.getOpdEmr = (hospcode, pid, seq, ev) => {
      $rootScope.items = {};
      $rootScope.items.hospcode = hospcode;
      $rootScope.items.pid = pid;
      $rootScope.items.seq = seq;

      $mdDialog.show({
          controller: 'OpdEmrCtrl',
          templateUrl: './templates/dialogs/opd-emr.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    $scope.getIpdEmr = (hospcode, pid, an, ev) => {
      $rootScope.items = {};
      $rootScope.items.hospcode = hospcode;
      $rootScope.items.pid = pid;
      $rootScope.items.an = an;

      $mdDialog.show({
          controller: 'IpdEmrCtrl',
          templateUrl: './templates/dialogs/ipd-emr.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        });
    };

    $scope.getLabFu = (hospcode, pid, seq, ev) => {
      $rootScope.items = {};
      $rootScope.items.hospcode = hospcode;
      $rootScope.items.pid = pid;
      $rootScope.items.seq = seq;

      $mdDialog.show({
        controller: 'LabFuCtrl',
        templateUrl: './templates/dialogs/lab-result.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      });
    };


    $scope.showDrugAllergy = (ev) => {
      $rootScope.cid = $scope.cid;

      $mdDialog.show({
        controller: 'DrugAllergyCtrl',
        templateUrl: './templates/dialogs/drugallergy.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      });
    };

  });
