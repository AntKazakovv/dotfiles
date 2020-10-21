import {IErrorTypes} from 'wlc-engine/modules/error/config/error-types';

export const errorTypes: IErrorTypes = {
    '5.0.0': {
        description: 'Post by slug is not found',
        name: 'Post by slug is not found',
        type: 'Post_by_slug_not_found',
    },
    '5.0.1': {
        description: 'The response time from the WP exceeded 3 seconds',
        name: 'Long answer WP',
        type: 'Long_answer_WP',
    },
    '5.0.2': {
        description: 'Error while getting data from WP',
        name: 'Error in getData WP-REST-API',
        type: 'Error_In_GetData_WP-REST-API',
        level: 'fatal',
    },
    '5.0.3': {
        description: 'WP data.data is not array',
        name: 'WP data.data is not array',
        type: 'WP_Data.data_Is_Not_Array',
        level: 'error',
    },
    '5.0.4': {
        description: 'Error while getting CategoryBySlug from WP',
        name: 'Error in getCategoryIdBySlug WP-REST-API',
        type: 'Error_In_getCategoryIdBySlug_WP-REST-API',
        level: 'fatal',
    },
    '5.0.5': {
        description: 'Error while getting getSubCategories from WP',
        name: 'Error in getSubCategories WP-REST-API',
        type: 'Error_In_getSubCategories_WP-REST-API',
        level: 'fatal',
    },
    '5.0.6': {
        description: 'Error while getting getPostsListByCategory from WP',
        name: 'Error in getPostsListByCategory WP-REST-API',
        type: 'Error_In_getPostsListByCategory_WP-REST-API',
        level: 'fatal',
    },
    '5.1.0': {
        description: 'Error receiving WP content data from a external source',
        name: 'Error receiving WP content from External Sites',
        type: 'Error_External_Data_WP',
        level: 'fatal',
    },
    '5.1.1': {
        description: 'Empty WP content from a external source',
        name: 'Empty WP content from a external source',
        type: 'Empty_External_Data_WP',
        level: 'warning',
    },
    '5.1.2': {
        description: 'Response from WP an external source doesn`t match with pattern',
        name: 'Pattern doesn`t match',
        type: 'Pattern_Not_Match_To_Data_WP',
        level: 'error',
    },
    '5.1.3': {
        description: 'URL to an external source is not specified',
        name: 'URL is not specified',
        type: 'Empty_External_Data_WP',
        level: 'warning',
    },
};
