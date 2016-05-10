'use strict';
/* global angular */

angular.module('app.services.LabFu', [])
  .factory('LabFuService', ($q, $http, Connection) => {
    
    let url = Connection.getCloudUrl();
    
    return {
      getLabResult(cid, labcode) {
        let q = $q.defer();
        let _url = `${url}/api/labfu`;
        
        $http.post(_url, {cid: cid, labcode: labcode})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));
        
        return q.promise;
      },
      getService(cid) {
        let q = $q.defer();
        let _url = `${url}/api/labfu/service`;

        $http.post(_url, {cid: cid})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },
      
      getList(hospcode, pid, seq) {
        let q = $q.defer();
        let _url = `${url}/api/labfu/list`;

        $http.post(_url, {hospcode, pid, seq})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },

      getCreatinine(cid) {
        let q = $q.defer();
        let _url = `${url}/api/labfu/creatinine`;

        $http.post(_url, {cid: cid})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      }
    };
  });
