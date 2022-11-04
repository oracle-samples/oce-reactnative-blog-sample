/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import { queryItems, getItem, getRenditionURLFromServer } from './content-rn';

/*
 * Utility method to log an error.
 */
function logError(message, error) {
  if (error && error.statusMessage) {
    console.log(`${message} : `, error.statusMessage);
  } else if (error.error && error.error.code && error.error.code === 'ETIMEDOUT') {
    console.log(`${message} : `, error);
  } else if (error.error && error.error.code) {
    console.log(`${message} : `, error.error.code);
  } else if (error) {
    console.error(message, error);
  }
}

/**
 * Fetch the top level values to be displayed on the home page.
 *
 * @returns {Promise({object})} - A Promise containing the data to display on the top level page
 */
export function fetchHomePage() {
  return queryItems({
    q: '(type eq "OCEGettingStartedHomePage" AND name eq "HomePage")',
  }).then((topLevelItem) => {
    if (topLevelItem != null
        && topLevelItem.items != null
        && topLevelItem.items.length > 0) {
      return {
        logoID: topLevelItem.items[0].fields.company_logo.id,
        title: topLevelItem.items[0].fields.company_name,
        topics: topLevelItem.items[0].fields.topics,
        aboutUrl: topLevelItem.items[0].fields.about_url,
        contactUrl: topLevelItem.items[0].fields.contact_url,
      };
    }
    return null;
  }).catch((error) => logError('Getting home page data', error));
}

/**
 * Fetch details about the specific topic
 *
 * @param {String} topicId - the id of the topic
 * @returns {*} - the topic
 */
export function fetchTopic(topicId) {
  return getItem({
    id: topicId,
    expand: 'fields.thumbnail',
  }).then((topic) => topic)
    .catch((error) => logError('Fetching topic failed', error));
}

/**
 * Get all the articles for the specified topic.
 *
 * @param {String} topicId - the id of the topic
 * @returns {*} - the list of articles for the topic
 */
export function fetchArticles(topicId) {
  return queryItems({
    q: `(type eq "OCEGettingStartedArticle" AND fields.topic eq "${topicId}")`,
    orderBy: 'fields.published_date:desc',
  }).then((articles) => {
    if (articles != null) {
      return articles.items;
    }
    return null;
  }).catch((error) => logError('Fetching articles failed', error));
}

/**
 * Get details of the specified article.
 *
 * @param {String} articleId - The id of the article
 * @returns {*} - the article
 */
export function fetchArticle(articleId) {
  return getItem({
    id: articleId,
    expand: 'fields.author',
  }).then((article) => article)
    .catch((error) => logError('Fetching article failed', error));
}

/**
 * Return the thumbnail URL for the specified item.
 *
 * @param {String} identifier - the Id of the item whose thumbnail URL is required
 * @returns {String} - the thumbnail URL
 */
export function getMediumRenditionURL(identifier) {
  return getItem({
    id: identifier,
    expand: 'fields.renditions',
  }).then((asset) => {
    const object = asset.fields.renditions.filter((item) => item.name === 'Medium')[0];
    const format = object.formats.filter((item) => item.format === 'jpg')[0];
    const self = format.links.filter((item) => item.rel === 'self')[0];
    const url = self.href;
    return url;
  }).catch((error) => logError('Fetching medium rendition URL failed', error));
}

/**
 * Return the rendition URL for the specified item.
 *
 * @param {String} identifier - the Id of the item whose rendition URL is required
 * @returns {String} - the rendition URL
 */
export function getRenditionURL(identifier) {
  const url = getRenditionURLFromServer({
    id: identifier,
  });
  return Promise.resolve(url);
}
