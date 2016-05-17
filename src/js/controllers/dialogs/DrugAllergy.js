'use strict';

angular.module('app.cotrollers.dialogs.DrugAllergy', ['app.services.Allergy'])
  .controller('DrugAllergyCtrl', ($scope, $mdDialog, $log, $rootScope, AllergyService) => {
    $scope.allergies = [];
    // Get allergy
    AllergyService.getAllergy($rootScope.cid)
      .then(data => {
        $log.info(data.rows);
        if (data.ok) {
          data.rows.forEach(v => {
            let obj = {};
            obj.REPORTER = `${v.REPORT_HOSPCODE} - ${v.REPORT_HOSPNAME}`;
            obj.INFORM = `${v.INFORM_HOSPCODE} - ${v.INFORM_HOSPNAME}`;
            obj.TYPEDX = v.TYPEDX;
            obj.LEVELNAME = v.LEVELNAME;
            obj.DNAME = v.DNAME;

            $scope.allergies.push(obj);
          });
        }
      });

   $scope.cancel = () => {
      $mdDialog.cancel();
    };

  });