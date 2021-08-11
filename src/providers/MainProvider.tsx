import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  mediaDevices,
  MediaStream,
  MediaStreamConstraints,
} from 'react-native-webrtc';
import {MainContext as MainContextType} from '../contexts';
import {navigate} from '../navigation';
import {GetUsersSucceededResult, User} from 'chatkitty';
import kitty from '../chatkitty';

const initialValues: MainContextType = {
  login: () => {},
  currentUser: null,
  users: [],
  localStream: null,
  remoteStream: null,
  remoteUser: null,
  call: () => {},
  switchCamera: () => {},
  toggleMute: () => {},
  isMuted: false,
  closeCall: () => {},
  logout: () => {},
  activeCall: null,
};

export const MainContext = React.createContext(initialValues);

interface Props {}

const MainContextProvider: React.FC<Props> = ({children}) => {
  const [currentUser, setCurrentUser] = useState(initialValues.currentUser);
  const [users, setUsers] = useState<User[]>(initialValues.users);
  const [localStream, setLocalStream] = useState<MediaStream | null>(
    initialValues.localStream,
  );
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(
    initialValues.remoteStream,
  );
  const [remoteUser, setRemoteUser] = useState<User | null>(null);
  const [isMuted, setIsMuted] = useState(initialValues.isMuted);
  const [activeCall, setActiveCall] = useState<any>(null);

  useEffect(() => {
    kitty.onCurrentUserChanged(user => {
      setCurrentUser(user);
    });
  }, []);

  const login = async (username: string) => {
    const isFrontCamera = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFrontCamera ? 'front' : 'environment';
    const videoSourceId = devices.find(
      (device: any) => device.kind === 'videoinput' && device.facing === facing,
    );
    const facingMode = isFrontCamera ? 'user' : 'environment';
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };

    const newStream = await mediaDevices.getUserMedia(constraints);

    setLocalStream(newStream as MediaStream);

    await kitty.startSession({username: username});

    kitty.getUsers({filter: {online: true}}).then(result => {
      setUsers((result as GetUsersSucceededResult).paginator.items);
    });

    kitty.onUserPresenceChanged(async () => {
      setUsers(
        (
          (await kitty.getUsers({
            filter: {online: true},
          })) as GetUsersSucceededResult
        ).paginator.items,
      );
    });
  };

  const call = (user: User) => {
    console.log(user);
  };

  const switchCamera = () => {
    if (localStream) {
      // @ts-ignore
      localStream.getVideoTracks().forEach(track => track._switchCamera());
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
        setIsMuted(!track.enabled);
      });
    }
  };

  const closeCall = () => {
    activeCall?.close();
    setActiveCall(null);
    setRemoteUser(null);
    navigate('Users');
    Alert.alert('Call is ended');
  };

  const logout = async () => {
    await kitty.endSession();
    setActiveCall(null);
    setRemoteUser(null);
    setLocalStream(null);
    setRemoteStream(null);
  };

  return (
    <MainContext.Provider
      value={{
        currentUser,
        users,
        setUsers,
        localStream,
        setLocalStream,
        remoteStream,
        setRemoteStream,
        login,
        call,
        switchCamera,
        toggleMute,
        isMuted,
        closeCall,
        logout,
        remoteUser,
        activeCall,
      }}>
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
