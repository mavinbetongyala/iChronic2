'use strict';
/* global angular */

angular.module('app.services.CommunityService', [])
  .factory('CommunityService', ($q, $http, Connection) => {
    
    let url = Connection.getCloudUrl();
    
    return {
      getService(cid) {
        let q = $q.defer();
        let _url = `${url}/api/community_service`;
        
        $http.post(_url, {cid: cid})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));
        
        return q.promise;
      }
    };
  });
