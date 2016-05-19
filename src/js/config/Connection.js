'use strict';
/* global angular */

angular.module('app.config.Connection', [])
  .factory('Connection', ($q, $log, Configure) => {
    let config = Configure.getConfigure();
    $log.info(config);

    return {
      getHISConnection() {
        return require('knex')({
          client: 'mysql',
          connection: config.hos
        });
      },

      getCloudUrl() {
        return config.url;
      },

      getHospitalInfo(db) {
        let q = $q.defer();
        let sql = `SELECT hospitalcode, hospitalname FROM opdconfig LIMIT 1`;

        db.raw(sql, [])
          .then(rows => {
            q.resolve(rows[0][0]);
          })
          .catch(err => q.reject(err));

        return q.promise;
      }
    }
  });
