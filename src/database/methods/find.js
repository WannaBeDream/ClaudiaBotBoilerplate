const { logger } = require('../../helpers');
const { UserModel, AdvertModel } = require('../../models');
const { ADS_PAGE_SIZE } = require('../../constants/db-values');

const findMyAds = async (criteria) => {
    try {
        return await AdvertModel.find({ author: criteria.author }).sort({ updatedAt: -1 });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable find your advertisements');
    }
};

const findAdsAll = async ({ location, radius, user }) => {
    try {
        return await AdvertModel.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [location.longitude, location.latitude]
                    },
                    $maxDistance: radius * 1000
                }
            },
            isActive: true,
            spam: { $nin: [user] },
            author: { $ne: user } // not return own user`s advertisements
        }).sort({ updatedAt: -1 });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable find advertisements');
    }
};

const findAdsByCategory = async ({ location, radius, category, user }) => {
    try {
        return await AdvertModel.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [location.longitude, location.latitude]
                    },
                    $maxDistance: radius * 1000
                }
            },
            isActive: true,
            category,
            spam: { $nin: [user] },
            author: { $ne: user } // not return own user`s advertisements
        }).sort({ updatedAt: -1 });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable find advertisements');
    }
};

const findSavedAds = async (criteria) => {
    try {
        return await AdvertModel.find({ usersSaved: { $in: [criteria.user] }, spam: { $nin: [criteria.user] } }).sort({
            updatedAt: -1
        });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable find saved advertisements');
    }
};

const findUser = async (telegramId) => {
    try {
        const user = await UserModel.findById(telegramId);
        return user && user._doc;
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable find user');
    }
};

const findAdAndReturnOneField = async (id, data) => {
    try {
        return await AdvertModel.findById({ _id: id }, data);
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error(error.message);
    }
};

const findAdvertisement = async (id) => {
    try {
        return await AdvertModel.findById({ _id: id });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error(error.message);
    }
};

const findUserAndReturnOneField = async (id) => {
    try {
        return await AdvertModel.findById({ _id: id }, { activeAdToUpdate: true });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error(error.message);
    }
};


module.exports = {
    findMyAds,
    findAdsByCategory,
    findSavedAds,
    findUser,
    findAdvertisement,
    findAdAndReturnOneField,
    findUserAndReturnOneField
};
