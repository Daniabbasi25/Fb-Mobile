import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { Utils } from '../../utils';
import {COLORS} from '../../constants';

interface FilterButton {
  title: boolean;
  icon: ImageSourcePropType;
  onPress: () => void;
  active: boolean;
}

const FilterButton = ({ title, icon, onPress, active }: FilterButton) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.filter,
        backgroundColor: active ? COLORS.green : COLORS.darkgray,
      }}
      onPress={onPress}
    >
      <Image
        source={icon}
        style={{ width: 50, height: 50 }}
        resizeMode={'contain'}
      />
      <View style={{flex:1}}>
        <Text style={styles.text}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filter: {
    shadowOpacity: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 3,
    paddingHorizontal: 5,
  },
  text: {
    fontWeight: '500',
    color: '#29455f',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default FilterButton;
