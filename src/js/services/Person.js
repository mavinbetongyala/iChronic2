'use strict';

angular.module('app.services.Person', [])
  .factory('PersonService', ($q) => {
    return {
      getChronic(db) {
        let q = $q.defer();
        let sql = `
        select p.person_id, p.cid, p.pname, p.fname, p.lname, p.sex, p.birthdate,
        c.clinic_member_status_id, group_concat(cl.name separator ',') as clinic
        from person as p
        inner join clinicmember as c on c.hn=p.patient_hn
        left join clinic_member_status as cs on cs.clinic_member_status_id=c.clinic_member_status_id
        left join clinic as cl on cl.clinic=c.clinic
        where cs.provis_typedis in ('03', '3')
        and c.clinic in ('001', '002')
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
          where cs.provis_typedis in ('03', '3')
          and c.clinic in ('001', '002')
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
          where cs.provis_typedis in ('03', '3')
          and c.clinic in ('001', '002')
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
          where cs.provis_typedis in ('03', '3')
          and c.clinic in ('001', '002')
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
      },
    }
  })