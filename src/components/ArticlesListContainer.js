/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import { ActivityIndicator, SafeAreaView, Text } from 'react-native';
import PropTypes from 'prop-types';
import { NAVIGATION, ROUTE } from '../types/index';

import ArticlesList from './ArticlesList';
import { fetchArticles } from '../scripts/services';
import { AppColors, CommonStyles } from '../styles/common';

/**
 * Component responsible for getting the list of articles for a topic.
 *
 * Note: This actual data is rendered in the "ArticlesList",
 * this design is to keep the model and view separate.
 *
 * @param {string} route The navigation route, used to get the topic id and name
 */
export default class ArticlesListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;

    this.state = {
      loading: true,
      error: false,
      articles: {},
    };
  }

  /**
   * Load the data for the specific topic
   */
  componentDidMount() {
    this.mounted = true;

    const { route, navigation } = this.props;
    const { topicId } = route.params;
    const { topicName } = route.params;

    // set the screen title to the name of the selected topic
    navigation.setOptions({ title: topicName });

    // fetch the articles for the topic
    fetchArticles(topicId)
      .then((articles) => {
        if (this.mounted) {
          if (articles == null) {
            this.setState({ error: true });
          } else {
            this.setState({ articles });
          }
        }
      })
      .catch((error) => {
        this.setState({ error: true });
        console.error(error);
      })
      .then(() => this.setState({ loading: false }));
  }

  /*
   * Called when the component unmounts.
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /*
   * Render an error if the topic was not found.
   * If the found was obtained ok render the "ArticlesList" component
   */
  render() {
    const { topicId, topicName, navigation } = this.props;
    const { error, loading, articles } = this.state;

    return (
      <SafeAreaView>
        {/* Render error */}
        {error && (
          <Text>Topic Not Found. Unable to list articles.</Text>
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
          <ArticlesList
            articles={articles}
            topicId={topicId}
            topicName={topicName}
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
ArticlesListContainer.propTypes = {
  navigation: NAVIGATION.isRequired,
  route: ROUTE.isRequired,
  topicId: PropTypes.string,
  topicName: PropTypes.string,
};

ArticlesListContainer.defaultProps = {
  topicId: '',
  topicName: '',
};
