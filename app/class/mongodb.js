const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL
const service = pegaServico(process.env.MONGO_URL)
var db

function pegaServico(mongo) {
    let i = mongo.search(/\?/)
    if (i > -1)
        return mongo.split("/")[mongo.split("/").length - 1].split("?")[0]
    else
        return mongo.split("/")[mongo.split("/").length - 1]
}

//inicia conexao com o banco de dados
MongoClient.connect(url, {
    poolSize: 40,
    auto_reconnect: true,
    useUnifiedTopology: true
}, function (err, d) {
    db = d;
})

module.exports.findOne = function findOne(collection, query) {
    return new Promise((res, rej) => {
        if (typeof db !== "undefined") {
            var dbo = db.db(service);
            dbo.collection(collection).findOne(query, (err, result) => {
                if (err) rej(err);
                else res(result);
            });
        }
    })
}

module.exports.updateOne = (collection, query, value) => {
    return new Promise((res, rej) => {
        if (typeof db !== "undefined") {
            var dbo = db.db(service);
            dbo.collection(collection).updateOne(query, { $set: value }, function (err, result) {
                if (err) rej(err)
                else res(result)
            });
        }
    })
}

module.exports.insertOne = function insertOne(collection, value) {
    return new Promise((res, rej) => {
        if (typeof db !== "undefined") {
            var dbo = db.db(service);
            dbo.collection(collection).insertOne(value, function (err, result) {
                if (err) rej(err)
                else res(result)
            })
        }
    })
}

module.exports.deleteOne = (collection, query, callback) => {
    return new Promise((res, rej) => {
        if (typeof db !== "undefined") {
            var dbo = db.db(service);
            dbo.collection(collection).deleteOne(query, function (err, result) {
                if (err) rej(err)
                else res(result)
            });
        }
    })
}