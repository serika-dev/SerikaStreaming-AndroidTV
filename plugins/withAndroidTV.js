const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Expo config plugin to add Android TV (Leanback) support to the AndroidManifest.
 *
 * Adds:
 *   <uses-feature android:name="android.software.leanback" android:required="false" />
 *   <uses-feature android:name="android.hardware.touchscreen" android:required="false" />
 *
 * The LEANBACK_LAUNCHER intent filter is declared in app.json under
 * android.intentFilters and is handled by Expo's built-in merge.
 */
module.exports = function withAndroidTV(config) {
    return withAndroidManifest(config, (config) => {
        const manifest = config.modResults.manifest;

        if (!manifest['uses-feature']) {
            manifest['uses-feature'] = [];
        }

        const features = manifest['uses-feature'];

        const hasLeanback = features.some(
            (f) => f.$?.['android:name'] === 'android.software.leanback'
        );
        if (!hasLeanback) {
            features.push({
                $: {
                    'android:name': 'android.software.leanback',
                    'android:required': 'false',
                },
            });
        }

        const hasTouchscreen = features.some(
            (f) => f.$?.['android:name'] === 'android.hardware.touchscreen'
        );
        if (!hasTouchscreen) {
            features.push({
                $: {
                    'android:name': 'android.hardware.touchscreen',
                    'android:required': 'false',
                },
            });
        }

        return config;
    });
};
