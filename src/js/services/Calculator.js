'use strict';
let _ = require('lodash');

angular.module('app.services.Calculator', [])
  .factory('CalculatorService', () => {
    return {
      egfr(cr, sex, age) {
        let egfr;
        let stage;

        if (sex == 2) { // woman
          if (cr <= 0.7) {
            egfr = 144 * Math.pow((cr / 0.7), -0.329) * Math.pow(0.993, age);
          } else {
            egfr = 144 * Math.pow((cr / 0.7), -1.209) * Math.pow(0.993, age);
          }
        } else { // man
          if (cr <= 0.9) {
            egfr = 144 * Math.pow((cr / 0.9), -0.411) * Math.pow(0.993, age);
          } else {
            egfr = 144 * Math.pow((cr / 0.9), -1.209) * Math.pow(0.993, age);
          }
        }

        if (egfr > 90) stage = 1;
        else if (egfr >= 60 && egfr <= 89) stage = 2;
        else if (egfr >= 30 && egfr <= 59) stage = 3;
        else if (egfr >= 15 && egfr <= 29) stage = 4;
        else stage = 5;

        return stage;
      },

      cvd(age, sex, smoke, dm, sbp, tc, ldl, hdl) {
        /*
        sex (int)     1 = ชาย,        0 = หญิง
        dm (int)      1 = เบาหวาน,    0 = ไม่เป็นเบาหวาน
        smoke (int)   1 = สูบ,         0 = ไม่สูบ
         */

        let full_score = 0;
        let predicted_risk = 0;
        let sur_root = 0.978296;

        if (age > 1 && sbp > 50) {
          if (ldl > 0) {
            if (hdl > 0) {
              full_score = (0.08305 * age) + (0.24893 * sex) + (0.02164 * sbp) + (0.65224 * dm) + (0.00243 * ldl) + ((-0.01965) * hdl) + (0.43868 * smoke);
              predicted_risk = 1 - (Math.pow(sur_root, Math.exp(full_score - 5.9826)));
            } else {
              full_score = (0.08169 * age) + (0.35156 * sex) + (0.02084 * sbp) + (0.65052 * dm) + (0.02094 * ldl) + (0.45639 * smoke);
              predicted_risk = 1 - (Math.pow(sur_root, Math.exp(full_score - 6.99911)));
            }
          } else if (tc > 0) {
            if (hdl > 0) {
              full_score = (0.083 * age) + (0.28094 * sex) + (0.02111 * sbp) + (0.69005 * dm) + (0.00214 * tc) + ((-0.02148) * hdl) + (0.40068 * smoke);
              predicted_risk = 1 - (Math.pow(sur_root, Math.exp(full_score - 6.00168)));
            } else {
              full_score = (0.08183 * age) + (0.39499 * sex) + (0.02084 * sbp) + (0.69974 * dm) + (0.00212 * tc) + (0.41916 * smoke);
              predicted_risk = 1 - (Math.pow(sur_root, Math.exp(full_score - 7.04423)));
            }
          }
        }

        if (predicted_risk > 0.3) { predicted_risk = 0.3 }

        return [full_score, predicted_risk];
      }
    }
  });