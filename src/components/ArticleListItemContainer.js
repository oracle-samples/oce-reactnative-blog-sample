/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { NAVIGATION } from '../types/index';

import ArticleListItem from './ArticleListItem';
import { getMediumRenditionURL } from '../scripts/services';

/**
 * Component responsible for getting the thumbnail for an article before using
 * "ArticleListItem" to render the article.
 *
 * Note: This actual data is rendered in the "ArticleListItem",
 * this design is to keep the model and view separate.
 *
 * This is called from "index.js" in the Router section when a user has clicked
 * on a link defined in "TopicListItem".
 *
 * @param {object} article The Article whose URL is to be obtained before its displayed
 */
export default class ArticleListItemContainer extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;

    this.state = {
      loading: true,
      article: {},
      articleUrl: '',
    };
  }

  /**
   * Load the data
   */
  componentDidMount() {
    this.mounted = true;

    const { article } = this.props;

    getMediumRenditionURL(article.fields.image.id)
      .then((url) => {
        if (this.mounted) {
          this.setState({
            article, articleUrl: url,
          });
        }
      })
      .then(() => this.setState({ loading: false }))
      .catch((error) => console.error(error));
  }

  /*
   * Called when the component unmounts.
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /*
   * Render nothing when the article information is being obtained from the server.
   * When the data is obtained render the "ArticleListItem" component
   */
  render() {
    const { navigation } = this.props;
    const { loading, article, articleUrl } = this.state;

    return (
      <View>
        {loading
          ? <Text />
          : (
            <ArticleListItem
              article={article}
              articleUrl={articleUrl}
              navigation={navigation}
            />
          )}
      </View>
    );
  }
}

/*
 * Define the type of data used in this component.
 */
ArticleListItemContainer.propTypes = {
  navigation: NAVIGATION.isRequired,
  article: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fields: PropTypes.shape({
      image: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};
