/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import {
  Dimensions, Image, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';

import PropTypes from 'prop-types';

import { AppColors, TextSizes } from '../styles/common';
import { dateToMDY } from '../scripts/utils';
import { getImageSource } from '../scripts/content-rn';

const styles = StyleSheet.create({

  article_details_root: {
    paddingBottom: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 24,
  },

  author: {
    color: AppColors.BLACK,
    fontSize: TextSizes.TEXT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },

  author_date: {
    marginLeft: 20,
  },

  avatar: {
    height: 80,
    resizeMode: 'contain',
    width: 80,
  },

  caption: {
    color: AppColors.LIGHT_GREY,
    fontSize: TextSizes.TEXT_SIZE_MEDIUM,
    textAlign: 'center',
  },

  date: {
    color: AppColors.LIGHT_GREY,
    fontSize: TextSizes.TEXT_SIZE_SMALL,
    marginTop: 3,
  },

  html: {
    marginBottom: 40,
    marginTop: 20,
  },

  image: {
    // height and width are determined in code
    flex: 1,
    resizeMode: 'contain',
  },

  top_row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },

});

/**
 * Component representing Article details.
 *
 * Note: This is called from "ArticleDetailsContainer" which gets the data
 * to display in this component, this design is to keep the model and view separate.
 *
 * @param {object} article The Article to display
 * @param {string} authorAvatarUrl The URL for the Authors avatar image
 * @param {string} articleImageUrl The URL for the article image
 * @param {string} topicName The Article title, used when rendering breadcrumbs
 */
export default class ArticleDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gotAllData: false, // ImageSize
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
    const { articleImageUrl } = this.props;

    Image.getSize(
      articleImageUrl,
      (width, height) => {
        this.setState({
          gotAllData: true,
          actualImageWidth: width,
          actualImageHeight: height,
        });
      },
    );
  }

  render() {
    const { article, articleImageUrl, authorAvatarUrl } = this.props;
    const {
      displayImageWidth, displayImageHeight, gotAllData,
    } = this.state;

    const formattedDate = `Posted on ${dateToMDY(article.fields.published_date.value)}`;

    const calculatedDisplayImageSize = ((!Number.isNaN(displayImageWidth) && displayImageWidth > 0)
      && (!Number.isNaN(displayImageHeight) && displayImageHeight > 0));

    const imageSizeStyle = {
      height: calculatedDisplayImageSize ? displayImageHeight : 0,
      width: calculatedDisplayImageSize ? displayImageWidth : 0,
    };
    const source = {
      html: article.fields.article_content,
    };

    if (gotAllData) {
      return (
        <ScrollView style={styles.article_details_root}>
          <View onLayout={(event) => this.onContainerLayout(event)}>

            <View style={styles.top_row}>
              {/* Avatar */}
              <Image
                style={styles.avatar}
                source={getImageSource(authorAvatarUrl)}
              />

              {/*  Author Name / Date */}
              <View style={styles.author_date}>
                <Text style={styles.author}>{article.fields.author.name}</Text>
                <Text style={styles.date}>
                  {formattedDate}
                  {' '}
                </Text>
              </View>
            </View>

            {/* Article Image and caption */}
            {calculatedDisplayImageSize && (
              <>
                <Image
                  style={[styles.image, imageSizeStyle]}
                  source={getImageSource(articleImageUrl)}
                />

                <Text style={styles.caption}>{article.fields.image_caption}</Text>
              </>
            )}

            {/* Article Content */}

            {/* Wrap the HTML content in a view which has padding, this is to ensure the very
                  last line of is visible at the bottom of the screen. Specify the 'tagsStyles'
                  so we can overwrite the spacing of the <p> tag so there is not too much white
                  space between paragraphs. */}
            <View style={styles.html}>
              <RenderHtml
                contentWidth={Dimensions.get('window').width}
                source={source}
                tagsStyles={{
                  p: {
                    marginTop: 0,
                    marginBottom: 0,
                    fontSize: 16,
                    color: AppColors.BLACK,
                  },
                }}
              />
            </View>
          </View>
        </ScrollView>
      );
    }

    return (null);
  }
}

/*
 * Define the type of data used in this component.
 */
ArticleDetails.propTypes = {
  authorAvatarUrl: PropTypes.string,
  articleImageUrl: PropTypes.string.isRequired,
  article: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fields: PropTypes.shape({
      image_caption: PropTypes.string.isRequired,
      article_content: PropTypes.string.isRequired,
      published_date: PropTypes.shape({
        value: PropTypes.string.isRequired,
      }),
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

ArticleDetails.defaultProps = {
  authorAvatarUrl: '',
};
