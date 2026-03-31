import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
    BackHandler,
    StyleSheet,
    View,
    Text,
    Image,
    Animated,
    Easing,
    StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

const WEBSITE_URL = 'https://streaming.serika.dev';
const PLATFORM_PARAM = 'androidtv';
const USER_AGENT =
    'Mozilla/5.0 (Linux; Android 12; AndroidTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SerikaTV/1.0 AndroidTV';

export default function App() {
    const webViewRef = useRef<WebViewType>(null);
    const [showLoading, setShowLoading] = useState(true);
    const [canGoBack, setCanGoBack] = useState(false);
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        activateKeepAwakeAsync();
        return () => {
            deactivateKeepAwake();
        };
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 800,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handleBackPress = useCallback(() => {
        if (canGoBack && webViewRef.current) {
            webViewRef.current.goBack();
            return true;
        }
        BackHandler.exitApp();
        return true;
    }, [canGoBack]);

    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => sub.remove();
    }, [handleBackPress]);

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <WebView
                ref={webViewRef}
                source={{ uri: `${WEBSITE_URL}/login?platform=${PLATFORM_PARAM}` }}
                style={styles.webview}
                onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
                onLoad={() => {
                    setTimeout(() => setShowLoading(false), 300);
                }}
                onError={() => setShowLoading(false)}
                allowsFullscreenVideo
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled
                domStorageEnabled
                allowsInlineMediaPlayback
                userAgent={USER_AGENT}
                mixedContentMode="always"
            />
            {showLoading && (
                <View style={styles.loadingScreen}>
                    <View style={styles.loaderContainer}>
                        <Image
                            source={require('./assets/icon.png')}
                            style={styles.logo}
                        />
                        <Animated.View
                            style={[styles.spinner, { transform: [{ rotate: spin }] }]}
                        />
                        <Text style={styles.loadingText}>Loading&hellip;</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    webview: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    loadingScreen: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    loaderContainer: {
        alignItems: 'center',
        gap: 32,
    },
    logo: {
        width: 160,
        height: 160,
        borderRadius: 24,
    },
    spinner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.15)',
        borderTopColor: '#e50914',
    },
    loadingText: {
        fontSize: 24,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 2,
    },
});
