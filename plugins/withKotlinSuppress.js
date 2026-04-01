const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Expo config plugin to suppress Kotlin version compatibility check.
 * Fixes: Compose Compiler 1.5.15 requires Kotlin 1.9.25 but RN uses 1.9.24
 */
module.exports = function withKotlinSuppress(config) {
  return withAppBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents;
    
    // Add suppress flag to composeOptions if not present
    if (!buildGradle.includes('suppressKotlinVersionCompatibilityCheck')) {
      // Find android { ... } block and add composeOptions
      buildGradle = buildGradle.replace(
        /(android\s*\{)/,
        `$1\n    composeOptions {\n        kotlinCompilerExtensionVersion = "1.5.14"\n    }\n    tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {\n        kotlinOptions {\n            freeCompilerArgs += [\n                '-P',\n                'plugin:androidx.compose.compiler.plugins.kotlin:suppressKotlinVersionCompatibilityCheck=true'\n            ]\n        }\n    }`
      );
    }
    
    config.modResults.contents = buildGradle;
    return config;
  });
};
