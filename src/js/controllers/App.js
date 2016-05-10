'use strict';

/* global angular */

angular.module('app.controllers.App', ['app.services.Person'])
.controller('AppCtrl', ($scope, $timeout, $mdSidenav, $log, $state, PersonService, Connection) => {

  let db = Connection.getHISConnection();
  $scope.person = [];
  // hide loading
  $scope.loading = false;

  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');

  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };

  $scope.toggleSearch = () => {
    $scope.showSearch = !$scope.showSearch;
    $scope.$apply();
  };

  let getChronic = () => {
    // show loading
    $scope.loading = true;
    PersonService.getChronic(db)
      .then(rows => {
        $scope.person = rows;
        // hide loading
        $scope.loading = false;
      }, err => {
        $log.error(err);
      });
  };

  getChronic();

  // Search person
  $scope.search = (e) => {
    if (e.which === 13) {
      if ($scope.query) {
        // show loading
        $scope.loading = true;

        $scope.person = [];

        if (isNaN($scope.query)) {
          // string query
          let _query = $scope.query.split(" ");
          if (_query.length > 1) {
            // search by fullname
            PersonService.searchChronicByFullname(db, _query[0], _query[1])
              .then(rows => $scope.person = rows);
            // hide loading
            $scope.loading = false;
          } else {
            // search by fname
            PersonService.searchChronicByName(db, $scope.query)
              .then(rows => $scope.person = rows);
            // hide loading
            $scope.loading = false;
          }
        } else {
          // search by cid, pid, hn
          PersonService.searchChronicByCidHNPid(db, $scope.query)
            .then(rows => $scope.person = rows);
          // hide loading
          $scope.loading = false;
        }
      } else {
        getChronic();
      }
    }
  };

  $scope.go = (state) => {
    $state.go(state);
  };


  function debounce(func, wait) {
    var timer;
    return function debounced() {
      var context = $scope,
        args = Array.prototype.slice.call(arguments);

      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }

  function buildDelayedToggler(navID) {
    return debounce(function() {
      $mdSidenav(navID)
      .toggle()
      .then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }

  function buildToggler(navID) {
    return function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
      .toggle()
      .then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    };
  }
});
