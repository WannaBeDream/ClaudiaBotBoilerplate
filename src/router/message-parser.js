const generalCommands = require('../features/general-commands');

const allCommands = Object.values(generalCommands);

function parseRegularCommand(update, availableCmds, lang) {
    return allCommands.find((c) => {
        return c.title[`${lang}`] === update.text && availableCmds.some((id) => id === c.id);
    });
}
function parseCallbackCommand(update) {
    const commandText = JSON.parse(update.text).cmd;
    return allCommands.find((c) => {
        return c.id === commandText;
    });
}

exports.parseCommand = (update, availableCmds, lang) => {
    const isNotCallback = !update.originalRequest.callback_query;
    const command = isNotCallback ? parseRegularCommand(update, availableCmds, lang) : parseCallbackCommand(update);
    return command || generalCommands.DATA_INPUT;
};

exports.parseChatData = (update) => {
    return !update.originalRequest.callback_query
        ? {
              chat_id: update.originalRequest.message.from.id,
              message_id: update.originalRequest.message.message_id
          }
        : {
              chat_id: update.originalRequest.callback_query.from.id,
              message_id: update.originalRequest.callback_query.message.message_id,
              callback_query_id: update.originalRequest.callback_query.id
          };
};

exports.parseDataInput = (update, lang) => {
    const datainputCommand = Object.values(adsDatainputCommands).find((c) => {
        return c.title[`${lang}`] === update.text;
    });

    return (
        (datainputCommand && datainputCommand.id) ||
        (update.originalRequest.callback_query && JSON.parse(update.text).key) ||
        (update.originalRequest.message && update.originalRequest.message.location) ||
        update.originalRequest.message.photo ||
        update.text
    );
};

exports.parseUser = (update) => {
    const message = update.originalRequest.message || update.originalRequest.callback_query;
    return {
        id: message.from.id,
        firstName: message.from.first_name,
        lastName: message.from.last_name
    };
};
