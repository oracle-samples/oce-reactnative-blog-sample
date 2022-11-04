/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import { NAVIGATION } from '../types/index';

import ArticleListItemContainer from './ArticleListItemContainer';
import { AppColors, Sizes } from '../styles/common';

/**
 * Component representing a list of Articles with a breadcrumb bar
 * at the top.
 *
 * Note: This is called from "ArticlesListContainer" which gets the data
 * to display in this component, this design is to keep the model and view separate.
 *
 * @param {array} articles the list of articles to render in this component
 * @param {string} topicId the ID of the topic
 * @param {string} topicName the name of the topic
 * @param {object} navigation navigation object, used to create a link
 */
export default class ArticlesList extends React.Component {
  constructor(props) {
    super(props);
    // bind functions so they can use "this"
    this.renderItem = this.renderItem.bind(this);
  }

  static renderSeparator() {
    return (
      <View
        style={{
          backgroundColor: AppColors.BORDER_COLOR,
          height: Sizes.LIST_ITEM_BORDER_WIDTH,
        }}
      />
    );
  }

  renderItem({ item, index }) {
    const { navigation } = this.props;

    return (
      <ArticleListItemContainer
        key={index}
        article={item}
        navigation={navigation}
      />
    );
  }

  render() {
    const { articles } = this.props;
    return (
      <View id="articles">
        <FlatList
          data={articles}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ArticlesList.renderSeparator}
          ListFooterComponent={ArticlesList.renderSeparator}
        />
      </View>
    );
  }
}

/*
 * Define the type of data used in this component.
 */
ArticlesList.propTypes = {
  navigation: NAVIGATION.isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }.propTypes),
  ).isRequired,
};
