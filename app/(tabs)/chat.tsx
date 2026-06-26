import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import {
    RecordingPresets,
    requestRecordingPermissionsAsync,
    setAudioModeAsync,
    useAudioPlayer,
    useAudioPlayerStatus,
    useAudioRecorder,
} from 'expo-audio';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
    id: string;
    text: string;
    type: 'text' | 'image' | 'audio';
    user: 'me' | 'them';
}

const AudioPlayer = ({ uri }: { uri: string }) => {
    const player = useAudioPlayer({ uri });
    const status = useAudioPlayerStatus(player);

    const handlePlayPause = () => {
        if (status.playing) {
            player.pause();
        } else {
            player.play();
        }
    };

    const progress =
        status.duration > 0
            ? (status.currentTime / status.duration) * 100
            : 0;

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={styles.audioPlayerContainer}>
            <TouchableOpacity onPress={handlePlayPause}>
                <Ionicons
                    name={status.playing ? 'pause' : 'play'}
                    size={24}
                    color="white"
                />
            </TouchableOpacity>

            <View style={styles.audioProgress}>
                <View
                    style={[
                        styles.audioProgressBar,
                        {
                            width: `${progress}%`,
                        },
                    ]}
                />
            </View>

            <Text style={styles.audioTime}>
                {formatTime(status.currentTime)}
            </Text>
        </View>
    );
};

const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');

    // Permissions
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const recorder = useAudioRecorder(
        RecordingPresets.HIGH_QUALITY
    );

    const [isRecording, setIsRecording] = useState(false);

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
        let permission = cameraPermission;
        if (!permission) {
            permission = (await requestCameraPermission()) as ImagePicker.CameraPermissionResponse;
        }

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

        if (!result.canceled && result.assets) {
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
        if (isRecording) {
            await recorder.stop();

            const uri = recorder.uri;

            setIsRecording(false);

            if (uri) {
                const newMessage: Message = {
                    id: Date.now().toString(),
                    text: uri,
                    type: 'audio',
                    user: 'me',
                };

                setMessages(prev => [newMessage, ...prev]);
            }

            return;
        }

        const permission =
            await requestRecordingPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                'Permission required',
                'You need to grant microphone permissions to record audio.'
            );
            return;
        }

        try {
            await setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true,
            });

            await recorder.prepareToRecordAsync();
            recorder.record();

            setIsRecording(true);
        } catch (error) {
            console.error('Failed to start recording', error);
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
                    <Ionicons
                        name={isRecording ? "stop-circle" : "mic-outline"}
                        size={24}
                        color={isRecording ? "red" : "#555"}
                    />
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