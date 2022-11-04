/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import React from 'react';
import {
  ActivityIndicator, Linking, Text, SafeAreaView, StyleSheet,
} from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';
import { NAVIGATION } from '../types/index';

import TopicsList from './TopicsList';
import { fetchHomePage } from '../scripts/services';
import { AppColors, CommonStyles, TextSizes } from '../styles/common';

const styles = StyleSheet.create({
  menuItem: {
    color: AppColors.BLACK,
  },

  overflowButton: {
    color: AppColors.WHITE,
    fontSize: TextSizes.TEXT_SIZE_LARGE,
    fontWeight: 'bold',
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },

  overflowMenu: {
    marginTop: 40,
  },

});

/**
 * Component representing a list of Topics with a header area
 * containing company logo, company name, Contact Us and About Us Links.
 */
export default class TopicsListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.overflowMenu = null;

    this.state = {
      loading: true,
      error: false,
      topicIds: [],
    };
  }

  /**
   * Load the data for the topics list
   */
  componentDidMount() {
    this.mounted = true;

    // get the top level item which contains the following information
    // - aboutURL / contactURL / company title
    // - array of topic ids : These are passed to TopicsList
    fetchHomePage()
      .then((topLevelItem) => {
        if (this.mounted && topLevelItem == null) {
          this.setState({ error: true });
          return;
        }

        const topicIdentifiers = topLevelItem.topics.map((topic) => topic.id);

        if (this.mounted) {
          this.setState({
            topicIds: topicIdentifiers,
          });

          this.setUpHeader(
            topLevelItem.title,
            topLevelItem.aboutUrl,
            topLevelItem.contactUrl,
          );
        }
      })
      .then(() => this.setState({ loading: false }))
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
   * Set up the contents of the navigation header, such as the title
   * and the drop down menu of options.
   */
  setUpHeader(companyTitle, aboutUrl, contactUsUrl) {
    const { navigation } = this.props;

    const menu = () => (
      <Menu
        style={styles.overflowMenu}
        onRequestClose={() => this.hideMenu()}
        ref={(ref) => this.setMenuRef(ref)}
        anchor={
          <Text onPress={() => this.showMenu()} style={styles.overflowButton}>&#8942;</Text>
        }
      >
        <MenuItem onPress={() => this.menuItemClicked(aboutUrl)} textStyle={styles.menuItem}>
          About Us
        </MenuItem>
        <MenuItem onPress={() => this.menuItemClicked(contactUsUrl)} textStyle={styles.menuItem}>
          Contact Us
        </MenuItem>
      </Menu>
    );

    navigation.setOptions({
      title: companyTitle,
      headerTitle: companyTitle,
      headerRight: menu,
    });
  }

  setMenuRef(ref) {
    this.overflowMenu = ref;
  }

  hideMenu() {
    this.overflowMenu.hide();
  }

  showMenu() {
    this.overflowMenu.show();
  }

  menuItemClicked(url) {
    this.overflowMenu.hide();
    Linking.openURL(url);
  }

  /*
   * Render this component
   */
  render() {
    const { navigation } = this.props;
    const { error, loading, topicIds } = this.state;
    return (
      <SafeAreaView>
        {/* Render error */}
        {error && (
          <Text>
            Oops, something went wrong.  Please verify that you have seeded
            data to the server and configured your serverUrl and channelToken.
          </Text>
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
        {!loading && !error && (
          <TopicsList
            topics={topicIds}
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
TopicsListContainer.propTypes = {
  navigation: NAVIGATION.isRequired,
};
