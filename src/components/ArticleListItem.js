/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import {
  Image, Text, TouchableHighlight, StyleSheet, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { NAVIGATION } from '../types/index';

import { AppColors, TextSizes } from '../styles/common';
import { dateToMDY } from '../scripts/utils';

import { getImageSource } from '../scripts/content-rn';

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },

  date: {
    color: AppColors.DARK_GREY,
    fontSize: TextSizes.TEXT_SIZE_SMALL,
    marginTop: 3,
  },

  description: {
    color: AppColors.BLACK,
    fontSize: TextSizes.TEXT_SIZE_MEDIUM,
    marginTop: 10,
  },

  image: {
    alignSelf: 'flex-end',
    height: 100,
    resizeMode: 'cover',
    width: 100,
  },

  info: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 16,
  },

  title: {
    color: AppColors.ACCENT,
    fontSize: TextSizes.TEXT_SIZE_MEDIUM_LARGE,
    fontWeight: 'bold',
  },

});

/**
 * Component representing an Article List Item displayed in the list of articles.
 *
 * Note: This is called from "ArticleListItemContainer" which gets the data
 * to display in this component, this design is to keep the model and view separate.
 *
 * @param {object} article The Article to display
 * @param {object} article The Article to display
 * @param {object} navigation navigation object, used to create a link
 */
// eslint-disable-next-line react/prefer-stateless-function
export default class ArticleListItem extends React.Component {
  render() {
    const { article, articleUrl, navigation } = this.props;
    const formattedDate = `Posted on ${dateToMDY(article.fields.published_date.value)}`;

    return (
      <TouchableHighlight
        onPress={() => navigation.navigate(
          'ArticleDetails',
          { articleId: article.id, articleTitle: article.name },
        )}
        underlayColor="white"
      >
        <View style={styles.containerView}>

          <Image
            style={styles.image}
            source={getImageSource(articleUrl)}
          />

          <View style={styles.info}>
            <Text style={styles.title}>{article.name}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.description}>{article.description}</Text>
          </View>

        </View>
      </TouchableHighlight>
    );
  }
}

/*
 * Define the type of data used in this component.
 */
ArticleListItem.propTypes = {
  navigation: NAVIGATION.isRequired,
  articleUrl: PropTypes.string.isRequired,
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    fields: PropTypes.shape({
      published_date: PropTypes.shape({
        value: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};
