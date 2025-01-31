import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const Home = () => {

    const {user, setAuth} = useAuth();

    console.log('user: ', user);

    const onLogout = async () =>{
        setAuth(null);
        const {error} = await supabase.auth.signOut();

        if(error){
            Alert.alert('Sign Out', "Error signing out!");
        }

    }

  return (
    <ScreenWrapper>
      <Text>home</Text>
      <Button title='Logout' onPress={onLogout}/>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})