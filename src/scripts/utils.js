/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import { Dimensions } from 'react-native';

/**
 * Function to take a date and return it as a formatted string.
 *
 * @param {Date} date the date to format into a nice string
 */
export function dateToMDY(date) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dateObj = new Date(date);
  const day = dateObj.getDay();
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Calculates the number of columns to display based on the screen
 * window width.
 */
export function calculateNumColumns() {
  let numColumns = 1;
  const screenWidth = Math.round(Dimensions.get('window').width);
  if (screenWidth <= 600) {
    numColumns = 1;
  } else if (screenWidth < 1200) {
    numColumns = 2;
  } else {
    numColumns = 3;
  }
  return numColumns;
}
