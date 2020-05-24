
var usersPool = {}

const showUsersPool = () => {
    return usersPool
}

const addUser = (data) => {
    usersPool[data.userId] = data
}

const getUserSocket = (userId) => {
    return usersPool[userId].socketId
}

const removeUserBySocketId = (socket) => {
    for(let user in usersPool){
       if(usersPool[user] === socket) {
           delete usersPool[user]
       }
    }
}

module.exports = {
    showUsersPool,
    addUser,
    getUserSocket,
    removeUserBySocketId,
}

    
