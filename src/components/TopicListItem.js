/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import {
  Image, Text, StyleSheet, TouchableHighlight, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { NAVIGATION } from '../types/index';

import { AppColors, TextSizes } from '../styles/common';
import { getImageSource } from '../scripts/content-rn';

const styles = StyleSheet.create({
  containerView: {
    alignItems: 'center',
  },

  description: {
    color: AppColors.BLACK,
    fontSize: TextSizes.TEXT_SIZE_MEDIUM,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },

  image: {
    // height and width are determined in code
    resizeMode: 'contain',
  },

  topicLabel: {
    color: AppColors.WHITE,
    fontSize: TextSizes.TEXT_SIZE_MEDIUM,
  },

  topicLabelContainer: {
    backgroundColor: AppColors.ACCENT_LIGHT,
    left: 0,
    paddingBottom: 8,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 8,
    position: 'absolute',
    top: 0,
    zIndex: 99,
  },
});

/**
 * Component representing a Topic displayed in the list of topics.
 *
 * Note: This is called from "TopicListItemContainer" which gets the data
 * to display in this component, this design is to keep the model and view separate.
 *
 * @param {string} topicName The topic's name
 * @param {string} imageUrl The URL of the topics thumbnail image
 * @param {string} description The topic's description
 * @param {string} topicId The ID of the Topic, used to render links to child views
 * @param {object} navigation navigation object, used to create a link
 */
export default class TopicListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gotData: false, // imageSize
    };

    this.getImageSize();
  }

  /*
   * When main layout view is drawn, get its size and use that to calculate the size of the
   * image view.  Its width will be the same as the main layout, and the height is calculated
   * from the image's ratio.
   */
  onContainerLayout(event) {
    const { width } = event.nativeEvent.layout;
    const containerWidth = Math.round(width);

    const { actualImageWidth, actualImageHeight } = this.state;
    const imageRatio = actualImageHeight / actualImageWidth;

    const height = Math.round(containerWidth * imageRatio);

    this.setState({
      displayImageWidth: containerWidth,
      displayImageHeight: height,
    });
  }

  /*
   * Determines the actual image's dimensions.
   *
   * This is used to calculate the image's width to height ratio so later the height
   * and width of the image view can be calculated.
   */
  getImageSize() {
    const { imageUrl } = this.props;

    Image.getSize(
      imageUrl,
      (width, height) => {
        this.setState({
          gotData: true,
          actualImageWidth: width,
          actualImageHeight: height,
        });
      },
    );
  }

  /*
   * Render the component
   */
  render() {
    // data has been obtained, render the content
    const {
      topicName, description, topicId, navigation, imageUrl,
    } = this.props;
    const {
      gotData, displayImageWidth, displayImageHeight,
    } = this.state;

    const calculatedDisplayImageSize = ((!Number.isNaN(displayImageWidth) && displayImageWidth > 0)
      && (!Number.isNaN(displayImageHeight) && displayImageHeight > 0));

    const imageSizeStyle = {
      height: calculatedDisplayImageSize ? displayImageHeight : 0,
      width: calculatedDisplayImageSize ? displayImageWidth : 0,
    };

    if (gotData) {
      return (
        <TouchableHighlight
          onPress={() => navigation.navigate('Articles', { topicId, topicName })}
          underlayColor="white"
        >

          <View
            style={styles.containerView}
            onLayout={(event) => this.onContainerLayout(event)}
          >

            <View style={styles.topicLabelContainer}>
              <Text style={styles.topicLabel}>{topicName}</Text>
            </View>

            {calculatedDisplayImageSize && (
              <Image
                style={[styles.image, imageSizeStyle]}
                source={getImageSource(imageUrl)}
              />
            )}

            <Text style={styles.description}>{description}</Text>

          </View>

        </TouchableHighlight>
      );
    }
    return (null);
  }
}

/*
 * Define the type of data used in this component.
 */
TopicListItem.propTypes = {
  navigation: NAVIGATION.isRequired,
  topicName: PropTypes.string.isRequired,
  topicId: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
