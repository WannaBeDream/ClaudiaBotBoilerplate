const { createUser } = require('../database/methods/create');
const { updateUserState } = require('../database/methods/update');
const { findUser } = require('../database/methods/find');

module.exports.getUserState = async (userId) => {
    let user = await findUser(userId);
    if (!user) {
        user = { _id: userId, appStateId:'newUserStart' , lang: 'ua' }; // передавать сюда новое состояние каждый раз
        await createUser(user);
    }
    return user;
};

module.exports.setUserState = async (userId, userState) => {
    await updateUserState(userId, userState);
};
