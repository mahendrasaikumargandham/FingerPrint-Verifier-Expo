import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { TouchableOpacity } from 'react-native';

export default function App() { 
  const [isFingerPrintSupported, setIsFingerPrintSupported] = useState(false);
  useEffect(() => {
    (async() => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsFingerPrintSupported(compatible);
    })();
  }, []);

  const fallBackToDefaultAuth = () => {
    console.log("fallback to password authentication");
  }

  const alertComponent = (title, mess, btnTxt, btnFunc) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc
      }
    ]);
  }

  const twoButtonAlert = () => {
    Alert.alert("Welcome to app ","Subscribe Now", [
      {
        text: "Back",
        onPress: () => console.log('cancel pressed'),
        style: "cancel"
      },
      {
        text: "Ok", 
        onPress: () => console.log('OK pressed')
      }
    ])
  }

  const handleFingerPrintAuth = async () => {
    const isFingerPrintAvailable = await LocalAuthentication.hasHardwareAsync();
    if(!isFingerPrintAvailable) {
      return alertComponent(
        'Please enter your password',
        'FingerPrint not available',
        'ok',
        () => fallBackToDefaultAuth()
      )
    }

    let supportedFingerPrint;
    if(isFingerPrintAvailable) {
      supportedFingerPrint = await LocalAuthentication.supportedAuthenticationTypesAsync()
    }
    const savedFingerPrint = await LocalAuthentication.isEnrolledAsync();
    if(!savedFingerPrint) {
      alertComponent(
        'FingerPrint not found',
        'Please logon with password',
        'ok',
        () => fallBackToDefaultAuth()
      )
    }

    const FingerPrintAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Please verify to enter the classes",
      disableDeviceFallback: false
    });

    if(FingerPrintAuth) {
      twoButtonAlert();
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>
          {isFingerPrintSupported ? 
            'your device is supported for FingerPrint': 'Fingerprint not available'     
          }
        </Text>
      </View>
      <TouchableOpacity
        style = {styles.button}
        onPress={() => handleFingerPrintAuth()}
      >
        <Text>Login</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: "#0c002b",
    padding: 10,
    alignSelf: "center",
  }
});
