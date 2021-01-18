const { MONGO_URI } = require('../config');
const appStateDao = require('./app-state-mongo');
const messageParser = require('./message-parser');
const langResources = require('../features/unknown-labels');
const { connectToDatabase } = require('../database/create-connection');
const { logger } = require('../helpers');

module.exports = async (update) => {
    try {
        console.log(update.originalRequest.message || update.originalRequest.callback_query);
        await connectToDatabase(MONGO_URI);

        const user = messageParser.parseUser(update);
        const userState = await appStateDao.getUserState(user.id);

        if (!transition) {
            return langResources.unknownCommand[userState.lang];
        }

    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        return error.message;
    }
};
