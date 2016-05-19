'use strict';

let {app} = require('electron').remote;

angular.module('app.controllers.dialogs.Connection', [])
  .controller('ConnectionCtrl', ($scope, $mdDialog, Configure) => {

    $scope.cancel = () => {
      $mdDialog.cancel();
    };

    $scope.config = Configure.getConfigure();

    $scope.save = () => {
      Configure.saveConfigure($scope.config)
        .then(() => {
          var confirm = $mdDialog.confirm()
            .title('แจ้งเตือน')
            .textContent('การบันทึกข้อมูลเสร็จเรียบร้อยแล้ว คุณจำเป็นต้องทำการปิดโปรแกรม แล้วเริ่มใหม่')
            .ariaLabel('Alert')
            .ok('ใช่ ปิดโปรแกรม!')
            .cancel('ทำงานต่อ');
          $mdDialog.show(confirm).then(function () {
            app.quit();
          }, function () {

          });
        }, err => {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Error!')
              .textContent('ไม่สามารถบันทึกค่าได้ [' + JSON.stringify(err) + ']')
              .ariaLabel('Alert Dialog')
              .ok('ตกลง')
          );
        });
    };

  });