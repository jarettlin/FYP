import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/themes'
import Icon from '../assets/icons'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/commons'
import Input from '../components/Input'
import Button from '../components/Button'
import { supabase } from '../lib/supabase'

const Signup = () => {
  const router = useRouter();
  const emailRef= useRef();
  const passwordRef= useRef();
  const nameRef= useRef();
  const [loading, setLoading]= useState(false);

  const onSubmit = async() =>{
    if(!emailRef.current || !passwordRef.current){
      Alert.alert('Login', "please fill all the fields!");
      return;
    }


    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const {data: {session}, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data:{
          name
        }
      }
    });

    setLoading(false);

    //console.log('session: ', session);
    //console.log('error: ', error);
    if(error){
        Alert.alert('Sign up'. error.message);
    }

  }

  return (
    <ScreenWrapper>
      <StatusBar style="dark"/>
      <View style={styles.container}>
        <BackButton router={router}/>

        {/*Welcome txt*/}
        <View>
          
          <Text style={styles.welcometxt}>Create your account</Text>
        </View>

        {/*Input*/}
        <View style={styles.form}>
          <Text style={styles.formtxt}>Enter your details to create an account</Text>

          <Input
          icon={<Icon name="user" size={26} strokeWidth={1.6}/>}
          placeholder='Enter your name'
          onChangeText={value=>{nameRef.current = value}}
          />

          <Input
          icon={<Icon name="email" size={26} strokeWidth={1.6}/>}
          placeholder='Enter your email'
          onChangeText={value=>{emailRef.current = value}}
          />

          <Input
          icon={<Icon name="password" size={26} strokeWidth={1.6}/>}
          placeholder='Enter your password'
          secureTextEntry
          onChangeText={value=>{passwordRef.current = value}}
          />  

          

          <Button title='Sign Up' loading={loading} onPress={onSubmit}/>
          
        </View>

        {/*footer*/}

        <View style={styles.footer}>
          <Text style={styles.footertxt}>Already have an accounts?</Text>

          <Pressable onPress={()=>router.push('login')}>
            <Text style={[styles.footertxt, {color: theme.colors.primaryDark}, {fontWeight: theme.fonts.semibold}]}>Login</Text>

          </Pressable>

        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Signup

const styles = StyleSheet.create({

  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },

  welcometxt: {
    textAlign:'center',
    fontSize: hp(4),
    fontWeight: theme.fonts.semibold,
     
  },

  form: {
    gap: 25
  },


  formtxt: {

  },

  forgotpasswordtxt: {
    textAlign: 'right',
    color : 'blue'
  },

  footer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  footertxt: {

  }








})