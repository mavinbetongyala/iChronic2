'use strict';
/* global angular */

angular.module('app.config.Connection', [])
  .factory('Connection', ($q) => {
    return {
      getHISConnection() {
        return require('knex')({
          client: 'mysql',
          connection: {
            host: 'localhost',
            port: 3306,
            database: 'hos',
            user: 'sa',
            password: 'sa',
            charset: 'utf8'
          }
        })
      },
      getCloudUrl() {
        return 'http://localhost:3000'
      }
    }
  });
