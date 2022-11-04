/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import { ActivityIndicator, SafeAreaView, Text } from 'react-native';
import { NAVIGATION, ROUTE } from '../types/index';

import ArticleDetails from './ArticleDetails';
import { fetchArticle, getRenditionURL, getMediumRenditionURL } from '../scripts/services';
import { AppColors, CommonStyles } from '../styles/common';

/**
 * Component responsible for getting the details of an Article.
 *
 * Note: This actual data is rendered in the "ArticleDetails",
 * this design is to keep the model and view separate.
 *
 * This is called from "index.js" in the Router section when a user has clicked
 * on a link defined in "ArticleListItem".
 *
 * @param {string} articleId The ID of the Article, used to get article information from the server
 * @param {string} articleTitle The Title of the Article, used to display in the title
 */
export default class ArticleDetailsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;

    this.state = {
      loading: true,
      error: false,
      article: {},
    };
  }

  componentDidMount() {
    this.mounted = true;

    const { route, navigation } = this.props;
    const { articleId, articleTitle } = route.params;

    // set the screen title to the name of the selected topic
    navigation.setOptions({ title: articleTitle });

    // Get the article details
    fetchArticle(articleId)
      .then((article) => {
        if (this.mounted) {
          this.setState({ article });
        }

        // get the article image URL
        getRenditionURL(article.fields.image.id)
          .then((renditionUrl) => {
            if (this.mounted) {
              this.setState({ articleImageUrl: renditionUrl });
            }

            // Get the author's avatar image
            getMediumRenditionURL(article.fields.author.fields.avatar.id)
              .then((thumbnailUrl) => {
                if (this.mounted) {
                  this.setState({ authorAvatarUrl: thumbnailUrl });
                  this.setState({ loading: false });
                }
              });
          });
      })
      .catch((error) => {
        this.setState({ error: true });
        console.error(error);
      });
  }

  /*
   * Called when the component unmounts.
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /*
   * Render an error if the article was not found.
   * If the article was obtained ok render the "ArticleDetails" component
   */
  render() {
    const { navigation } = this.props;

    const {
      error, loading, article, articleImageUrl, authorAvatarUrl,
    } = this.state;

    return (
      <SafeAreaView>
        {/* Render error */}
        {error && (
          <Text>Article Not Found. Unable to view article details</Text>
        )}

        {/* Render loading */}
        {loading && !error && (
          <ActivityIndicator
            style={CommonStyles.progressSpinner}
            size="large"
            color={AppColors.ACCENT}
          />
        )}

        {/* Render data */}
        {!error && !loading && (
          <ArticleDetails
            article={article}
            articleImageUrl={articleImageUrl}
            authorAvatarUrl={authorAvatarUrl}
            navigation={navigation}
          />
        )}
      </SafeAreaView>
    );
  }
}

/*
 * Define the type of data used in this component.
 */
ArticleDetailsContainer.propTypes = {
  navigation: NAVIGATION.isRequired,
  route: ROUTE.isRequired,
};
