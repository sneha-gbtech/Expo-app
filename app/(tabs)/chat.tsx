import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { Audio } from 'expo-av';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
    id: string;
    text: string;
    type: 'text' | 'image' | 'audio';
    user: 'me' | 'them';
}

const AudioPlayer = ({ uri }: { uri: string }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    useEffect(() => {
        const loadSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: false },
                (status) => {
                    if (status.isLoaded) {
                        setIsPlaying(status.isPlaying);
                        setDuration(status.durationMillis || 0);
                        setPosition(status.positionMillis || 0);
                        if (status.didJustFinish) {
                            sound.setPositionAsync(0); // Reset position on finish
                        }
                    }
                }
            );
            setSound(sound);
        };

        loadSound();

        return () => {
            sound?.unloadAsync();
        };
    }, [uri]);

    const handlePlayPause = async () => {
        if (!sound) return;
        isPlaying ? await sound.pauseAsync() : await sound.playAsync();
    };

    const formatTime = (millis: number) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={styles.audioPlayerContainer}><TouchableOpacity onPress={handlePlayPause}><Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="white" /></TouchableOpacity><View style={styles.audioProgress}><View style={[styles.audioProgressBar, { width: `${(position / duration) * 100}%` }]} /></View><Text style={styles.audioTime}>{formatTime(position)}</Text></View>
    );
};

const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');

    // Permissions
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [micPermission, requestMicPermission] = Audio.usePermissions();

    // Audio Recording State
    const [recording, setRecording] = useState<Audio.Recording | undefined>();

    // This hook provides the height of the header, but since we have no header,
    // it can be used with the tab bar height for a more accurate offset.
    const headerHeight = useHeaderHeight();

    const handleSendMessage = () => {
        if (inputText.trim().length > 0) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: inputText,
                type: 'text',
                user: 'me',
            };
            // Optimistically update the UI with the new message
            setMessages(prev => [newMessage, ...prev]);
            setInputText('');
        }
    };

    const handleCameraPress = async () => {
        const permission = cameraPermission?.granted ? cameraPermission : await requestCameraPermission();
        if (!permission.granted) {
            Alert.alert('Permission required', 'You need to grant camera permissions to take a photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: result.assets[0].uri,
                type: 'image',
                user: 'me',
            };
            setMessages(prev => [newMessage, ...prev]);
        }
    };

    const handleAudioPress = async () => {
        if (recording) {
            // Stop recording
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(undefined);
            if (uri) {
                const newMessage: Message = { id: Date.now().toString(), text: uri, type: 'audio', user: 'me' };
                setMessages(prev => [newMessage, ...prev]);
            }
        } else {
            // Start recording
            const permission = micPermission?.granted ? micPermission : await requestMicPermission();
            if (!permission.granted) {
                Alert.alert('Permission required', 'You need to grant microphone permissions to record audio.');
                return;
            }

            try {
                await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
                const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
                setRecording(recording);
            } catch (err) {
                console.error('Failed to start recording', err);
            }
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[styles.messageBubble, item.user === 'me' ? styles.myMessage : styles.theirMessage]}>
            {item.type === 'text' && <Text style={item.user === 'me' ? styles.myMessageText : styles.theirMessageText}>{item.text}</Text>}
            {item.type === 'image' && <Image source={{ uri: item.text }} style={styles.chatImage} />}
            {item.type === 'audio' && <AudioPlayer uri={item.text} />}
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={headerHeight}
        >
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                inverted
                contentContainerStyle={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={handleCameraPress} style={styles.iconButton}>
                    <Ionicons name="camera-outline" size={24} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAudioPress} style={styles.iconButton}>
                    <Ionicons name={recording ? "stop-circle" : "mic-outline"} size={24} color={recording ? "red" : "#555"} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.iconButton}>
                    <Ionicons name="send" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0' },
    messageList: { paddingHorizontal: 10, paddingVertical: 20 },
    messageBubble: { padding: 10, borderRadius: 15, maxWidth: '70%', marginBottom: 10 },
    myMessage: { backgroundColor: '#007AFF', alignSelf: 'flex-end' },
    theirMessage: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start' },
    myMessageText: { color: 'white' },
    theirMessageText: { color: 'black' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: '#f7f7f7',
    },
    iconButton: {
        padding: 10,
    },
    chatImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    audioPlayerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 200,
    },
    audioProgress: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 2,
        marginHorizontal: 10,
    },
    audioProgressBar: {
        height: 4,
        backgroundColor: 'white',
        borderRadius: 2,
    },
    audioTime: {
        color: 'white',
        fontSize: 12,
    }
});

export default ChatScreen;