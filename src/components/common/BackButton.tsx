import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Utils} from '../../utils';
import {COLORS, icons} from '../../constants';
import {useNavigation} from '@react-navigation/core';

export interface BackButtonProps {
}

const BackButton = ({}: BackButtonProps) => {
  const styles = stylesCreator({});

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.mainWrapper}
      onPress={() => navigation.goBack()}
    >
      <Image
        source={icons.back}
        resizeMode="contain"
        style={styles.backButtonIcon}
      />
    </TouchableOpacity>

  );
};

export default BackButton;

const stylesCreator = ({}: {}) => StyleSheet.create({
  mainWrapper: {
    justifyContent: 'center',
  },
  backButtonIcon: {
    marginLeft: 10,
    width: 23,
    height: 23,
  },
});
