import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


import {COLORS, icons} from '../constants';
import ListOrders from '../screens/ListOrders';
import SideMenuContent from '../screens/SideMenuContent';
import {useIntl} from 'react-intl';
import {translateText} from '../lang/translate';
import Home from '../screens/Home';
import Filter from '../screens/Filter';

const Tab = createBottomTabNavigator();

const TabBarCustomButton = ({children, onPress}: any) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        height: 55,
        backgroundColor: COLORS.white,
      }}
      activeOpacity={1}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const SideMenuLinkIcon = ({focused, iconName, text}: { focused: boolean; iconName: string; text: string }) => {
  return (
    <View
      style={{alignItems: 'center', justifyContent: 'center', top: 1}}>
      <Image
        // @ts-ignore
        source={icons[iconName]}
        resizeMode="contain"
        style={{
          width: 23,
          height: 25,
          tintColor: focused ? COLORS.primary : COLORS.secondary,
        }}
      />
      <Text
        style={{
          color: focused ? COLORS.primary : COLORS.secondary,
          fontSize: 12,
        }}>
        {text}
      </Text>
    </View>
  );
};

const HomeTabs = () => {
  const intl = useIntl();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      // tabBarOptions={{
      //   showLabel: false,
      //   style: {
      //     left: 0,
      //     right: 0,
      //     elevation: 0,
      //   },
      // }}
    >
      <Tab.Screen
        // TODO: rename to availableOffers
        name="HOME"
        component={Home}
        options={{
          tabBarIcon: props => <SideMenuLinkIcon {...props} text={translateText(intl, 'tab.home')}
                                                 iconName={'explore'}/>,
          tabBarButton: props => <TabBarCustomButton {...props} />,
        }}
      />

      <Tab.Screen
        name="FILTER"
        component={Filter}
        options={{
          tabBarIcon: props => <SideMenuLinkIcon {...props} text={translateText(intl, 'tab.filter')}
                                                 iconName={'filter'}/>,
          tabBarButton: props => <TabBarCustomButton {...props} />,
        }}
      />

      <Tab.Screen
        name="ORDERS"
        component={ListOrders}
        options={{
          tabBarIcon: props => <SideMenuLinkIcon {...props} text={translateText(intl, 'tab.orders')}
                                                 iconName={'orders'}/>,
          tabBarButton: props => <TabBarCustomButton {...props} />,
        }}
      />

      <Tab.Screen
        name="MENU"
        component={SideMenuContent}
        options={{
          tabBarIcon: props => <SideMenuLinkIcon {...props} text={translateText(intl, 'tab.menu')} iconName={'menu'}/>,
          tabBarButton: props => <TabBarCustomButton {...props} />,
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.openDrawer();
          },
        })}
      />

    </Tab.Navigator>
  );
};

export default HomeTabs;
