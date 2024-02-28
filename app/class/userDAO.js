var mongodb = require('./mongodb');

module.exports = class UserDAO {
    /**
     * Pega um usuario no banco
     * @param {String} user
     */
    findOne(user) {
        return new Promise((res, rej) => {
            mongodb.findOne('usuariosMQTT', user)
                .then(user => { res(user) })
                .catch(err => { rej(err); })
        })
    }

    updateUser(query, value) {
        return new Promise((res, rej) => {
            mongodb.updateOne("usuariosMQTT", query, value)
                .then(result => { res(result) })
                .catch(err => { rej(err); })
        })
    }

    /**
     * Insere usuario no DB sem ter um projeto
     * @param {Object} user 
     */
    insertUser(user) {
        return new Promise((res, rej) => {
            mongodb.insertOne("usuariosMQTT", user)
                .then(result => { res(result) })
                .catch(err => { rej(err); })
        })
    }

    verificaAuth(user) {
        return new Promise(res => {
            this.findOne(user)
                .then(user => {
                    if (user) res({ user, status: true })
                    else res({ user, status: false })
                })
        })
    }
}