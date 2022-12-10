import React, {useState} from 'react';
import {Image, KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Controller} from 'react-hook-form';
import {COLORS, icons} from '../../constants';

interface FBFormInputProps {
  control: any;
  name: string;
  placeholder: string;
  secureTextEntry: boolean;
  image?: any;
  rules?: object;
  theme?: 'dark' | 'light';
  keyboardType?: KeyboardTypeOptions
}

const FBFormInput = (props: FBFormInputProps) => {
  const {
    control, name, placeholder, secureTextEntry, image, rules = {}, theme = 'light', keyboardType = 'default'
  } = props;

  const [isSecureTextEntry, setIsSecureTextEntry] = useState<boolean>(secureTextEntry);

  const styles = stylesCreator({theme});

  return (
    <Controller
      control={control}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <View style={styles.formFieldWrapper}>
          <View style={[
            styles.formFieldInputWrapper,
            error ? {borderColor: COLORS.red, borderWidth: 1} : {}]
          }>
            {image &&
              <View style={styles.formFieldIconWrapper}>
                <Image source={image} style={styles.formFieldIcon}/>
              </View>
            }

            <TextInput
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor={styles.formFieldInputPlaceholder.color}
              style={styles.formFieldInput}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={isSecureTextEntry}
            />

            {secureTextEntry &&
              <TouchableOpacity
                style={styles.formFieldIconWrapper}
                onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}
              >
                <Image source={icons.app_privacy_icon} style={styles.formFieldIcon}/>
              </TouchableOpacity>
            }
          </View>
          {error &&
            <Text style={styles.errorMsg}> {error?.message || 'omg'}</Text>
          }

        </View>
      )}
      name={name}
    />
  );
};

export default FBFormInput;

const stylesCreator = (params: { theme: 'dark' | 'light' }) => {
  const isDark = params.theme == 'dark';

  return StyleSheet.create({
    formFieldWrapper: {},
    formFieldInputWrapper: {
      flexDirection: 'row',
      backgroundColor: isDark ? 'rgba(100,100,100, 0.3)' : 'rgba(255,255,255, 0.1)',
      width: '100%',
      alignItems: 'center',
      marginTop: 20,
      alignSelf: 'center',
      paddingHorizontal: 10,
    },
    formFieldIconWrapper: {
      width: 20,
      height: 20,
      alignItems: 'center',
    },
    formFieldIcon: {
      tintColor: isDark ? '#000' : '#fff',
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
    formFieldInput: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      color: isDark ? '#000' : '#fff',
      flex: 1,
    },
    formFieldInputPlaceholder: {
      color: isDark ? '#000' : '#FFF',
    },
    errorMsg: {
      color: COLORS.red,
      fontSize: 12,
    },
  });
};
