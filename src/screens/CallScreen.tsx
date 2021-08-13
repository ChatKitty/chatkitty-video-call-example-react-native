import React, {useContext} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RTCView} from 'react-native-webrtc';
import IconButton from '../components/IconButton';
import icons from '../icons';
import {MainContext} from '../providers/MainProvider';

const {width, height} = Dimensions.get('window');

const CallScreen = () => {
  const {
    localStream,
    remoteStream,
    callSession,
    remoteUser,
    isMuted,
    closeCall,
    toggleMute,
    switchCamera,
  } = useContext(MainContext);

  return (
    <SafeAreaView style={styles.container}>
      {remoteStream && (
        <RTCView
          style={styles.remoteStream}
          streamURL={remoteStream.toURL()}
          objectFit="cover"
        />
      )}
      {localStream && (
        <View style={styles.myStreamWrapper}>
          <RTCView
            style={styles.myStream}
            objectFit="cover"
            streamURL={localStream.toURL()}
            zOrder={1}
          />
        </View>
      )}
      {!callSession && (
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator color="#341EFF" size={120} />
          <Text style={styles.callingText}>Calling {remoteUser?.name}</Text>
        </View>
      )}
      <View style={styles.iconsWrapper}>
        <IconButton
          icon={icons.CHANGE_CAMERA}
          onPress={switchCamera}
          iconColor={'#341EFF'}
          backgroundColor="#fff"
        />
        {isMuted ? (
          <IconButton
            icon={icons.UNMUTE}
            onPress={toggleMute}
            iconColor={'#fff'}
            backgroundColor="red"
          />
        ) : (
          <IconButton
            icon={icons.MUTE}
            onPress={toggleMute}
            iconColor={'#341EFF'}
            backgroundColor="#fff"
          />
        )}
        <IconButton
          icon={icons.END_CALL}
          onPress={closeCall}
          iconColor={'#fff'}
          backgroundColor="red"
        />
      </View>
    </SafeAreaView>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f0f0f',
    flex: 1,
    position: 'relative',
  },
  myStream: {
    height: width * 0.6,
    width: width * 0.4,
  },
  myStreamWrapper: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: width * 0.6 + 8,
    width: width * 0.4 + 8,
    backgroundColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteStreamWrapper: {},
  remoteStream: {
    width: '100%',
    height: '100%',
  },
  spinnerWrapper: {
    top: height * 0.3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callingText: {
    fontSize: 26,
    color: '#fff',
  },
  iconsWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});
