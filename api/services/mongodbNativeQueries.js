/**
 * Created by shoaibarshad on 6/20/19.
 */

module.exports = {

  find: async({collectionName, query = {} , limit /* Type int*/, offset/* Must send if limit */, sort/* Type Object eg: { 'createdAt': -1 } */}) => {

    const db = sails.getDatastore('MongodbServer').manager;

    if (!collectionName) {
      return "collectionName is required";
    }
//.limit(limit).skip(offset).sort({ 'createdAt': -1 })
    return new Promise((resolve, reject) => {

      let cursor = db.collection(collectionName).find(query);

      if(limit){
        cursor.limit(limit)
      }

      if(offset){
        cursor.skip(offset)
      }

      if(sort){
        cursor.sort(sort)
      }

      cursor.toArray(function (err, results) {
        if (err)
          reject(err);
        else{
          if (results.length == 0) {
            resolve(results);
          }else{

            let promises = results.map(async (element) => {
              element.id = element._id.toString();
              delete element._id
              return element
            })

            Promise.all(promises).then(function (response) {
              resolve(response);
            });

          }
        }

      })

    })



  },

  count: async({collectionName, query = {}}) => {

    const db = sails.getDatastore('MongodbServer').manager;

    if (!collectionName) {
      return "collectionName is required";
    }

    let cursor = db.collection(collectionName).count(query);

    return cursor

  },

  random: async({collectionName, query, size}) => {

    const db = sails.getDatastore('MongodbServer').manager;

    let params = []
    size = size ? size : 1;

    if (!collectionName) {
      return "collectionName is required";
    }

    if (query) {
      params.push(query);
    }

    params.push({$sample: {size: size}})
    return new Promise((resolve, reject) => {

      db.collection(collectionName).aggregate(params).toArray(function (err, results) {
        if (err)
          reject(err);
        else
          resolve(results)

      })

    })
  },

  aggregate: async({collectionName, aggregation}) => {
    const db = sails.getDatastore('MongodbServer').manager;
    if (!collectionName) {
      return "collectionName is required";
    }

    return new Promise((resolve, reject) => {

      db.collection(collectionName).aggregate(aggregation).toArray(function (err, results) {
        if (err)
          reject(err);
        else
          resolve(results)
      })

    })



  },

  distinct: async({collectionName, fieldName}) => {

    const db = sails.getDatastore('MongodbServer').manager;

    if (!collectionName) {
      return "collectionName is required";
    }

    let cursor = db.collection(collectionName).distinct(fieldName);

    return cursor
  },

  distinctWithQuery: async({collectionName, query, fieldName}) => {

    const db = sails.getDatastore('MongodbServer').manager;

    if (!collectionName) {
      return "collectionName is required";
    }

    let cursor = db.collection(collectionName).distinct(fieldName, query);

    return cursor
  }

}
