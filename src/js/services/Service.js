'use strict';
/* global angular */

angular.module('app.services.Service', [])
  .factory('ServiceService', ($q, $http, Connection) => {

    let url = Connection.getCloudUrl();

    return {
      getServices(cid) {
        let q = $q.defer();
        let _url = `${url}/api/services`;

        $http.post(_url, {cid: cid})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },

      getServiceInfo(hospcode, pid, seq) {
        let q = $q.defer();
        let _url = `${url}/api/services/info`;

        $http.post(_url, {hospcode: hospcode, pid: pid, seq: seq})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },

      getDiagnosisOpd(hospcode, pid, seq) {
        let q = $q.defer();
        let _url = `${url}/api/services/diagnosis_opd`;

        $http.post(_url, {hospcode: hospcode, pid: pid, seq: seq})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },

      getProcedureOpd(hospcode, pid, seq) {
        let q = $q.defer();
        let _url = `${url}/api/services/procedure_opd`;

        $http.post(_url, {hospcode: hospcode, pid: pid, seq: seq})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },

      getDrugOpd(hospcode, pid, seq) {
        let q = $q.defer();
        let _url = `${url}/api/services/drug_opd`;

        $http.post(_url, {hospcode: hospcode, pid: pid, seq: seq})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },

      getChargeOpd(hospcode, pid, seq) {
        let q = $q.defer();
        let _url = `${url}/api/services/charge_opd`;

        $http.post(_url, {hospcode: hospcode, pid: pid, seq: seq})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },

      // IPD Service
      getDiagnosisIpd(hospcode, pid, an) {
        let q = $q.defer();
        let _url = `${url}/api/services/diagnosis_ipd`;

        $http.post(_url, {hospcode: hospcode, pid: pid, an: an})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },

      getProcedureIpd(hospcode, pid, an) {
        let q = $q.defer();
        let _url = `${url}/api/services/procedure_ipd`;

        $http.post(_url, {hospcode: hospcode, pid: pid, an: an})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },

      getDrugIpd(hospcode, pid, an) {
        let q = $q.defer();
        let _url = `${url}/api/services/drug_ipd`;

        $http.post(_url, {hospcode: hospcode, pid: pid, an: an})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      },

      getChargeIpd(hospcode, pid, an) {
        let q = $q.defer();
        let _url = `${url}/api/services/charge_ipd`;

        $http.post(_url, {hospcode: hospcode, pid: pid, an: an})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection error'));

        return q.promise;
      }

    };
  });
