'use strict';

angular.module('app.controllers.dialogs.ExportSmoking', ['app.services.Person'])
  .controller('ExportSmokingCtrl', ($scope, $mdDialog, $log, PersonService, Connection) => {

    let {app} = require('electron').remote;
    let path = require('path');
    let fse = require('fs-extra');
    let fs = require('fs');
    let open = require('open');
    let _ = require('lodash');
    let request = require('request');

    let dataPath = app.getPath('appData');
    let appPath = path.join(dataPath, 'iChronic');
    let exportPath = path.join(appPath, 'exports');

    let JSZip = require("jszip");
    let zip = new JSZip();

    fse.ensureDirSync(appPath);
    fse.ensureDirSync(exportPath);

    $scope.cancel = () => {
      $mdDialog.cancel();
    };

    // $scope.loading = true;

    $scope.smokings = [];
    $scope.message_status = '...';

    let db = Connection.getHISConnection();

    PersonService.getChronic(db)
      .then(rows => {
        //$scope.message_status = 'เตรียมพร้อมข้อมูล - เสร็จเรียบร้อย';
        $scope.loading = false;
        $scope.person = rows;
      });

    $scope.addSmoking = (cid, name) => {
      let idx = _.find($scope.smokings, { cid: cid });
      if (idx >= 0) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('ข้อมูลซำ้')
            .textContent('มีอยู่ในทะเบียนแล้ว กรุณาเลือกใหม่')
            .ariaLabel('Alert Dialog')
            .ok('ยกเลิก')
        );
      } else {
        let obj = {};
        obj.cid = cid;
        obj.name = name;

        $scope.smokings.push(obj);

        $log.info($scope.smokings);
      }
    }


    // initial date
    $scope.startDate = new Date();
    $scope.endDate = new Date();

    $scope.getData = () => {
      $scope.smokings = [];
      $scope.hospcode = null;

      $scope.message_status = 'เตรียมพร้อมข้อมูล - กำลังเตรียมข้อมูล...';

      let startDate = moment($scope.startDate).format('YYYY-MM-DD');
      let endDate = moment($scope.endDate).format('YYYY-MM-DD');

      if (startDate && endDate) {
        $scope.loading = true;
        PersonService.getSmokingAll(db, startDate, endDate)
          .then(rows => {
            // $log.info(rows);
            rows.forEach(v => {
              let obj = {};
              $scope.hospcode = v.hospcode;
              obj.hospcode = v.hospcode;
              obj.cid = v.cid;
              obj.fullname = `${v.pname}${v.fname} ${v.lname}`;
              obj.vstdate = moment(v.vstdate).format('DD/MM/YYYY');
              obj.export_vstdate = moment(v.vstdate).format('YYYYMMDD');
              $scope.smokings.push(obj);
            });

            $scope.loading = false;
            $scope.message_status = 'เตรียมพร้อมข้อมูล - เสร็จเรียบร้อย รอส่งออก';
          });
      }
    };

    // Export data
    $scope.doExport = () => {

      if ($scope.smokings.length) {

        $scope.message_status = 'ส่งออกข้อมูล - กำลังส่งออกข้อมูล...';

        let smokingData = [];
        let txtFile = path.join(exportPath, 'smoking.txt');
        let header = ['HOSPCODE', 'CID', 'DATE_SERV', 'UPDATED'].join('|') + '\r\n';
        let zipFile = `CHRONIC-${$scope.hospcode}-${moment().format('YYYYMMDDHHmmss')}.zip`;

        fs.writeFileSync(txtFile, header);
        zipFile = path.join(exportPath, zipFile);

        $scope.smokings.forEach(v => {
          var obj = {};
          obj.HOSPCODE = v.hospcode;
          obj.CID = v.cid;
          obj.DATE_SERV = v.export_vstdate;
          obj.UPDATED = moment().format('YYYYMMDDHHmmss');

          let str = [obj.HOSPCODE, obj.CID, obj.DATE_SERV, obj.UPDATED].join('|') + '\r\n';
          fs.appendFileSync(txtFile, str);

        });


        // zip file
        $scope.message_status = 'ส่งออกข้อมูล - กำลัง zip ไฟล์...';

        zip.file("smoking.txt", fs.readFileSync(txtFile));

        zip.generateAsync({ type: "nodebuffer" })
          .then(buffer => {
            fs.writeFile(zipFile, buffer, function (err) {
              if (err) {
                $log.error(err);
                $scope.loading = false;
                $scope.message_status = 'ส่งออกข้อมูล - ไม่สามารถ zip ไฟล์ได้: ' + JSON.stringify(err);
              } else {
                $scope.loading = true;

                let _fs = fs.createReadStream(zipFile);
                let url = Connection.getCloudUrl();

                $scope.message_status = 'อัปโหลดไฟล์ - กำลังอัปโหลด';

                request.post({
                  url: url + '/uploads/smokings',
                  formData: {
                    file: _fs
                  }
                  //formData: data
                }, (err, res, body) => {
                  let _body = JSON.parse(body);
                  if (_body.ok === true) {
                    $scope.smokings = [];
                    $scope.loading = false;
                    $scope.message_status = 'อัปโหลดไฟล์ - อัปโหลดเสร็จเรียบร้อยแล้ว';

                  } else {
                    $scope.message_status = 'อัปโหลดไฟล์ - เกิดข้อผิดพลาด : ' + JSON.stringify(_body.msg);
                    $scope.loading = false;
                  }
                });
              }
            });

          });

      } else {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Error!')
            .textContent('ไม่พบข้อมูลที่ต้องการส่งออก')
            .ariaLabel('Alert Dialog')
            .ok('ตกลง')
        );
      }

    };

    $scope.doExportExcel = () => {
      let json2xls = require('json2xls');

      if ($scope.smokings.length) {
        let jsonData = [];
        $scope.smokings.forEach(v => {
          let obj = {};
          obj.CID = v.cid;
          obj.DATE_SERV = v.vstdate;
          jsonData.push(obj);
        });

        let xls = json2xls(jsonData);
        let excelPath = path.join(exportPath, 'smoking.xlsx');
        fs.writeFileSync(excelPath, xls, 'binary');
        $scope.message_status = 'ส่งออกไฟล์ - ส่งออกไฟล์เสร็จเรียบร้อยแล้ว';
        open(exportPath);

      } else {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Error!')
            .textContent('ไม่พบข้อมูลที่ต้องการส่งออก')
            .ariaLabel('Alert Dialog')
            .ok('ตกลง')
        );
      }
    };

  });