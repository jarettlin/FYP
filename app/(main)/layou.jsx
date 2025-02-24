import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Icon from '../../assets/icons'

const MainTabs = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
      name="home" 
      options={{ 
        title: 'Home' ,
        tabBarIcon: ({color, size}) => (
            <Icon name="home" strokeWidth={2.5} size={size} color={color}/>
        )
      }} />

      <Tabs.Screen 
      name="profile" 
      options={{ 
        title: 'Profile', 
        tabBarIcon: ({color, size}) => (
            <Icon name="user" strokeWidth={2.5} size={size} color={color}/>
        )
      }} />
    </Tabs>

  )
}

export default MainTabs