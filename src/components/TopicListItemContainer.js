/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { NAVIGATION } from '../types/index';

import TopicListItem from './TopicListItem';
import { fetchTopic, getMediumRenditionURL } from '../scripts/services';

/**
 * Component responsible for getting the the data for a single Topic
 * to display for that topic when rendered in the list of topics.
 *
 * Note: This actual data is rendered in the "TopicListItem",
 * this design is to keep the model and view separate.
 *
 * @param {string} id The ID of the Topic
 */
export default class TopicListItemContainer extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;

    this.state = {
      loading: true,
      title: '',
      description: '',
      url: '',
    };
  }

  /**
   * Load the data for the specific topic
   */
  componentDidMount() {
    this.mounted = true;
    const { id } = this.props;

    // fetch the topic
    fetchTopic(id)
      .then((topic) => {
        // once the topic is obtained, fetch the URL for the topic's thumbnail
        getMediumRenditionURL(topic.fields.thumbnail.id)
          .then((thumbnailUrl) => {
            if (this.mounted) {
              this.setState({
                title: topic.name,
                description: topic.description,
                url: thumbnailUrl,
                loading: false,
              });
            }
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }

  /*
   * Called when the component unmounts.
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /*
   * Render the TopicListItem to display the topic item
   */
  render() {
    const { id, navigation } = this.props;
    const {
      loading, title, url, description,
    } = this.state;

    return (
      <View>
        {loading
          ? <Text />
          : (
            <TopicListItem
              topicId={id}
              topicName={title}
              imageUrl={url}
              description={description}
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
TopicListItemContainer.propTypes = {
  navigation: NAVIGATION.isRequired,
  id: PropTypes.string.isRequired,
};
