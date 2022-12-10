import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS} from '../../constants';

interface FBButtonProps {
  onClick: () => void,
  title: string,
  backgroundColor?: string
}

const FBButton = ({onClick, title, backgroundColor = COLORS.green}: FBButtonProps) => {

  return (
    <TouchableOpacity
      style={[fbButtonStyles.container, {backgroundColor: backgroundColor}]}
      onPress={onClick}>
      <View>
        <Text style={fbButtonStyles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};


const fbButtonStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 5,
    height: 44,
    marginBottom: 5,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
  },
  title: {
    color: COLORS.white,
  },
});

export default FBButton;
