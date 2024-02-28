//https://github.com/moscajs/aedes
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 29367
const UserDAO = require("./app/class/userDAO");
let daouser = new UserDAO();

server.listen(port, _ => {
    console.log('broker na porta ' + port);
})

aedes.authenticate = async (client, username, password, callback) => {
    password = password.toString()
    let success = false
    let err = new Error('Auth Error')
    err.returnCode = 4
    let user = await daouser.verificaAuth({ username, password })
    if (user.status) {
        success = true
        err = null
        client._parser.settings.acls = user.user.acls
    }
    callback(err, success)
}

aedes.authorizePublish = function (client, packet, callback) {
    //fazer funcao para abstrair tudo isso
    let subTopic = packet.topic.split("/")
    let aclsTopic = client._parser.settings.acls.map(acl => { return acl.topic.split("/")[0] })
    let indexTopic = aclsTopic.indexOf("#")
    if (indexTopic > -1)
        return callback(null)
    indexTopic = aclsTopic.indexOf(subTopic[0])
    if (indexTopic > -1) {
        if (client._parser.settings.acls[indexTopic].pub) {
            let aclTopic = client._parser.settings.acls[indexTopic].topic.split("/")
            indexTopic = aclTopic.indexOf("#")
            if (indexTopic > -1) {
                aclTopic.splice(indexTopic)
                subTopic.splice(indexTopic)
            }
            if (aclTopic.join("/") === subTopic.join("/"))
                callback(null)
            else
                callback(new Error('wrong topic'))
        } else
            callback(new Error('wrong topic'))
    } else
        callback(new Error('wrong topic'))
}

aedes.authorizeSubscribe = function (client, sub, callback) {
    //mudanca
    let subTopic = sub.topic.split("/")
    let aclsTopic = client._parser.settings.acls.map(acl => { return acl.topic.split("/")[0] })
    let indexTopic = aclsTopic.indexOf("#")
    if (indexTopic > -1)
        return callback(null, sub)
    indexTopic = aclsTopic.indexOf(subTopic[0])
    if (indexTopic > -1) {
        if (client._parser.settings.acls[indexTopic].pub) {
            aclsTopic = client._parser.settings.acls[indexTopic].topic.split('/')
            for (const i in aclsTopic) {
                if (aclsTopic[i] === subTopic[i])
                    continue
                else if (aclsTopic[i] === "#")
                    break
                else
                    return callback(new Error('wrong topic'))
            }
            callback(null, sub)
        }
    } else
        callback(new Error('wrong topic'))
}