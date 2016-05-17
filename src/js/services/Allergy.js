'use strict';

angular.module('app.services.Allergy', [])
  .factory('AllergyService', function ($q, $http, Connection) {

    let url = Connection.getCloudUrl();

    return {
      getAllergy(cid) {
        let q = $q.defer();
        let _url = `${url}/api/allergy`;

        $http.post(_url, {cid: cid})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      }
    }
  });