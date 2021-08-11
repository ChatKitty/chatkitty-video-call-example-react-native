import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CallScreenNavigationProp} from '../navigation';

interface Props {
  navigation: CallScreenNavigationProp;
}

const CallScreen = ({}: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Call</Text>
    </SafeAreaView>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {},
});
