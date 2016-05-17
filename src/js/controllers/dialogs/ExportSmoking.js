'use strict';

angular.module('app.controllers.dialogs.ExportSmoking', ['app.services.Person'])
  .controller('ExportSmokingCtrl', (
    $scope, $mdDialog,
    PersonService, Connection
  ) => {

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  let db = Connection.getHISConnection();

  // Get all chronic
  // PersonService.getChronicAll(db)
  //   .then(rows => {
  //     $scope.person = rows;
  //   });

  $scope.smokings = [
    {id: 0, name: 'ไม่สูบ'},
    {id: 1, name: 'สูบ'}
  ];

});