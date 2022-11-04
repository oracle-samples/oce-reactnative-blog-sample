/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import {
  Dimensions, FlatList, StyleSheet, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { NAVIGATION } from '../types/index';

import TopicListItemContainer from './TopicListItemContainer';
import { AppColors, Sizes } from '../styles/common';
import { calculateNumColumns } from '../scripts/utils';

const styles = StyleSheet.create({
  flatListContainer: {
    marginVertical: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },

  listItemBorder: {
    borderColor: AppColors.BORDER_COLOR,
    borderWidth: Sizes.LIST_ITEM_BORDER_WIDTH,
  },

  listItemContainer: {
    flex: 1,
    margin: 10,
  },

  listItemInvisible: {
    backgroundColor: AppColors.TRANSPARENT,
  },
});

/**
 * Component representing a list of Topics.
 *
 * Note: This is called from "TopicsListContainer" which gets the data
 * to display in this component, this design is to keep the model and view separate.
 *
 * @param {array} topics the list of topics Ids to render in this component
 */
export default class TopicsList extends React.Component {
  constructor(props) {
    super(props);
    const screenWidth = Math.round(Dimensions.get('window').width);
    const numColumns = calculateNumColumns();

    this.state = {
      numColumns,
      currentScreenWidth: screenWidth,
    };

    // bind functions so they can use "this"
    this.addEmptyItemsToData = this.addEmptyItemsToData.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onTopViewLayout = this.onTopViewLayout.bind(this);
  }

  /*
   * When the top view's layout changes, determine if there was a change in
   * the device width, if there is adjust the list column number accordingly.
   */
  onTopViewLayout() {
    const { currentScreenWidth } = this.state;
    const newScreenWidth = Math.round(Dimensions.get('window').width);

    if (newScreenWidth !== currentScreenWidth) {
      const numColumns = calculateNumColumns();
      this.setState({
        numColumns,
        currentScreenWidth: newScreenWidth,
      });
    }
  }

  /*
   * If the last row of the list does not fill all the columns,
   * pad the data out with empty items.
   */
  addEmptyItemsToData() {
    const { topics } = this.props;
    const { numColumns } = this.state;
    const numberOfFullRows = Math.floor(topics.length / numColumns);
    let numberOfElementsLastRow = topics.length - (numberOfFullRows * numColumns);

    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      topics.push(`BLANK_ITEM-${numberOfElementsLastRow}`);
      numberOfElementsLastRow += 1;
    }

    return topics;
  }

  /*
   * Renders the item by either rendering a view with no contents and transparent
   * background, or by rendering a TopicListlistItemContainer based on whether item
   * is an empty padding item.
   */
  renderItem({ item, index }) {
    const { navigation } = this.props;

    if (item.startsWith('BLANK_ITEM')) {
      return (
        <View
          style={[styles.listItemContainer, styles.listItemInvisible]}
        />
      );
    }

    return (
      <View style={[styles.listItemBorder, styles.listItemContainer]}>
        <TopicListItemContainer
          key={index}
          id={item}
          navigation={navigation}
        />
      </View>
    );
  }

  render() {
    const { numColumns } = this.state;

    return (
      <View onLayout={this.onTopViewLayout}>
        <FlatList
          data={this.addEmptyItemsToData()}
          style={styles.flatListContainer}
          renderItem={this.renderItem}
          keyExtractor={(item) => item}
          numColumns={numColumns}
          key={numColumns}
        />
      </View>
    );
  }
}

/*
 * Define the type of data used in this component.
 */
TopicsList.propTypes = {
  navigation: NAVIGATION.isRequired,
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
};
