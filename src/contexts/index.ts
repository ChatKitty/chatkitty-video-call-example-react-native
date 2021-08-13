import {MediaStream} from 'react-native-webrtc';
import React from 'react';
import {CallSession, CurrentUser, User} from 'chatkitty';

export interface MainContext {
  login: (username: string) => void;
  currentUser: CurrentUser | null;
  users: User[];
  setUsers?: React.Dispatch<React.SetStateAction<User[]>>;
  localStream: MediaStream | null;
  setLocalStream?: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  remoteStream: MediaStream | null;
  setRemoteStream?: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  call: (user: User) => void;
  switchCamera: () => void;
  toggleMute: () => void;
  isMuted: boolean;
  closeCall: () => void;
  logout: () => void;
  remoteUser: User | null;
  callSession: CallSession | null;
}
