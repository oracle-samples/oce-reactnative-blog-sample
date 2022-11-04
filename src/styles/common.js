/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import { StyleSheet } from 'react-native';

const Sizes = {
  LIST_ITEM_BORDER_WIDTH: 1,
};

const TextSizes = {
  TEXT_SIZE_LARGE: 20,
  TEXT_SIZE_MEDIUM_LARGE: 17,
  TEXT_SIZE_MEDIUM: 16,
  TEXT_SIZE_SMALL: 14,
};

const AppColors = {
  ACCENT: 'rgba(188, 8, 7, .95)',
  ACCENT_DARK: 'rgba(141, 0, 0, 1)',
  ACCENT_LIGHT: 'rgba(188, 8, 7, .85)',
  BLACK: 'black',
  BORDER_COLOR: '#ccc',
  DARK_GREY: 'rgb(115, 115, 115)',
  LIGHT_GREY: '#737373',
  RED: 'red',
  TRANSPARENT: 'transparent',
  WHITE: 'white',
};

const CommonStyles = StyleSheet.create({
  progressSpinner: {
    paddingTop: 20,
  },
});

export {
  AppColors, CommonStyles, TextSizes, Sizes,
};
