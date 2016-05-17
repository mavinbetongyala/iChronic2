'use strict';

angular.module('app.services.Person', [])
  .factory('PersonService', ($q) => {
    return {
      getSmoking(db, hn) {
        let q = $q.defer();

        let sql = `select st.nhso_code
          from opdscreen as o
          left join smoking_type as st on st.smoking_type_id=o.smoking_type_id
          where o.hn=?
          and o.smoking_type_id is not null
          order by o.vstdate desc
          limit 1`;

        db.raw(sql, [hn])
          .then(rows => q.resolve(rows[0][0].nhso_code))
          .catch(err => q.reject(err));
      },

      getInfo(db, cid) {
        let q = $q.defer();
        db('person')
          .where('cid', cid)
          .select(
            'pname', 'fname', 'lname', 'sex', 'birthdate',
            'patient_hn', 'person_id', 'cid', db.raw('timestampdiff(year, birthdate, current_date()) as age')
          )
          .limit(1)
          .then(rows => q.resolve(rows[0]))
          .catch(err => q.reject(err));

        return q.promise;
      },

      getChronicAll(db) {
        let q = $q.defer();
        let sql = `
        select p.person_id, p.cid, p.pname, p.fname, p.lname, p.sex, p.birthdate,
        c.clinic_member_status_id, group_concat(cl.name separator ',') as clinic,
        group_concat(cl.clinic separator ',') as clinic_code
        from person as p
        inner join clinicmember as c on c.hn=p.patient_hn
        left join clinic_member_status as cs on cs.clinic_member_status_id=c.clinic_member_status_id
        left join clinic as cl on cl.clinic=c.clinic
        where c.clinic in ('001', '002')
        and cs.provis_typedis in ('03', '3')
        group by p.person_id
        order by p.person_id
        `;

        db.raw(sql, [])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            q.reject(err)
          });

        return q.promise;
      },

      getChronic(db) {
        let q = $q.defer();
        let sql = `
        select p.person_id, p.cid, p.pname, p.fname, p.lname, p.sex, p.birthdate,
        c.clinic_member_status_id, group_concat(cl.name separator ',') as clinic,
        group_concat(cl.clinic separator ',') as clinic_code
        from person as p
        inner join clinicmember as c on c.hn=p.patient_hn
        left join clinic_member_status as cs on cs.clinic_member_status_id=c.clinic_member_status_id
        left join clinic as cl on cl.clinic=c.clinic
        where c.clinic in ('001', '002')
        and cs.provis_typedis in ('03', '3')
        group by p.person_id
        order by p.person_id
        limit 20
        `;

        db.raw(sql, [])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            q.reject(err)
          });

        return q.promise;
      },

      searchChronicByName(db, query) {
        let q = $q.defer();
        let _query = `%${query}%`;
        let sql = `
          select p.person_id, p.cid, p.pname, p.fname, p.lname, p.sex, p.birthdate,
          c.clinic_member_status_id, group_concat(cl.name separator ',') as clinic
          from person as p
          inner join clinicmember as c on c.hn=p.patient_hn
          left join clinic_member_status as cs on cs.clinic_member_status_id=c.clinic_member_status_id
          left join clinic as cl on cl.clinic=c.clinic
          where c.clinic in ('001', '002')
          and cs.provis_typedis in ('03', '3')
          and p.fname like ?
          group by p.person_id
          order by p.person_id
          limit 20
        `;

        db.raw(sql, [_query])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            q.reject(err)
          });

        return q.promise;
      },

      searchChronicByFullname(db, fname, lname) {
        let q = $q.defer();
        let _fname = `%${fname}%`;
        let _lname = `%${lname}%`;

        let sql = `
          select p.person_id, p.cid, p.pname, p.fname, p.lname, p.sex, p.birthdate,
          c.clinic_member_status_id, group_concat(cl.name separator ',') as clinic
          from person as p
          inner join clinicmember as c on c.hn=p.patient_hn
          left join clinic_member_status as cs on cs.clinic_member_status_id=c.clinic_member_status_id
          left join clinic as cl on cl.clinic=c.clinic
          where c.clinic in ('001', '002')
          and cs.provis_typedis in ('03', '3')
          and (p.fname like ? and p.lname like ?)
          group by p.person_id
          order by p.person_id
          limit 20
        `;

        db.raw(sql, [_fname, _lname])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            q.reject(err)
          });

        return q.promise;
      },

      searchChronicByCidHNPid(db, query) {
        let q = $q.defer();
        let sql = `
          select p.person_id, p.cid, p.pname, p.fname, p.lname, p.sex, p.birthdate,
          c.clinic_member_status_id, group_concat(cl.name separator ',') as clinic
          from person as p
          inner join clinicmember as c on c.hn=p.patient_hn
          left join clinic_member_status as cs on cs.clinic_member_status_id=c.clinic_member_status_id
          left join clinic as cl on cl.clinic=c.clinic
          where c.clinic in ('001', '002')
          and cs.provis_typedis in ('03', '3')
          and (p.cid=? or p.patient_hn=? or p.person_id=?)
          group by p.person_id
          order by p.person_id
          limit 20
        `;

        db.raw(sql, [query, query, query])
          .then(rows => {
            q.resolve(rows[0])
          })
          .catch(err => {
            q.reject(err)
          });

        return q.promise;
      }
    }
  });
