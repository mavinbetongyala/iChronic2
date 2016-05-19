'use static';

let fse = require('fs-extra');
let path = require('path');
let fs = require('fs');
let {app} = require('electron').remote;


angular.module('app.config.Configure', [])
  .factory('Configure', ($q, $log) => {

    let dataPath = app.getPath('appData');
    let appPath = path.join(dataPath, 'iChronic');
    let configFile = path.join(appPath, 'config.json');

    console.log(appPath);

    fse.ensureDirSync(appPath);

    return {
      initialConfigure() {

        fs.access(configFile, fs.W_OK && fs.R_OK, (err) => {
          if (err) {
            let defaultConfig = {
              hos: {
                host: '127.0.0.1',
                database: 'hos',
                port: 3306,
                user: 'sa',
                password: '123456'
              },

              url: 'http://localhost:3000',
              key: 'aaf891ddefffa0914b4d17e701cf5bd493ec2504'
            };

            fse.writeJsonSync(configFile, defaultConfig);

          }

        });

      },

      getConfigure() {
        return fse.readJsonSync(configFile);
      },

      saveConfigure(config) {
        let q = $q.defer();
        fse.writeJson(configFile, config, (err) => {
          if (err) {
            q.reject(err);
          } else {
            q.resolve();
          }
        });

        return q.promise;
      }

    }
  });