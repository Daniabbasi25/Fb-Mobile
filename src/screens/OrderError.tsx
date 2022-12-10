import React from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {Utils} from '../utils';
import {useIntl} from "react-intl";
import {translateText} from "../lang/translate";

interface OrderErrorProps {
  route: any;
  navigation: any;
}

const OrderError = (props: OrderErrorProps) => {
  const intl = useIntl();
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#F86C6C'}}>
        <View style={{marginHorizontal: 30, marginVertical: 20}}>
          <Text style={{...styles.text, marginTop: 30, textAlign: 'center'}}>
            {translateText(intl,'order_error.general')}
          </Text>
          <Text style={{...styles.text, marginTop: 20, width: Utils.width}}>
            {translateText(intl,'order_error.reason_1')}
          </Text>
          <Text style={{...styles.text, marginTop: 20}}>
            {translateText(intl,'order_error.reason_2')}
          </Text>
          <Text style={{...styles.text, marginTop: 20}}>
            {translateText(intl,'order_error.reason_3')}
          </Text>
          <TouchableOpacity
            style={styles.back}
            onPress={() => {
              props.navigation.navigate('Objects');
            }}>
            <Text style={{color: '#fff', fontWeight: '500'}}>
              {translateText(intl,'back')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
  },
  back: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'grey',
    padding: 10,
    marginHorizontal: 20,
    shadowOpacity: 0.1,
  },
});

export default OrderError;
