'use strict';
/* global angular */

angular.module('app.services.Admission', [])
  .factory('AdmissionService', ($q, $http, Connection) => {
    
    let url = Connection.getCloudUrl();
    
    return {
      getAdmission(cid) {
        let q = $q.defer();
        let _url = `${url}/api/admission`;
        
        $http.post(_url, {cid: cid})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));
        
        return q.promise;
      }
    };
  });
