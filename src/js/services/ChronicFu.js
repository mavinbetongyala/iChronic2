'use strict';
/* global angular */

angular.module('app.services.ChronicFu', [])
  .factory('ChronicFuService', ($q, $http, Connection) => {
    
    let url = Connection.getCloudUrl();
    
    return {
      getFu(cid) {
        let q = $q.defer();
        let _url = `${url}/api/chronicfu`;
        
        $http.post(_url, {cid: cid})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));
        
        return q.promise;
      }
    };
  });
