const { withGradleProperties, withProjectBuildGradle } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Suppress Kotlin version compatibility check and set Kotlin version
 */
module.exports = function withKotlinFix(config) {
  // Set gradle properties
  config = withGradleProperties(config, (config) => {
    const properties = config.modResults;
    
    // Set Kotlin version to 1.9.25
    const kotlinVersionIndex = properties.findIndex(p => p.type === 'property' && p.key === 'kotlinVersion');
    if (kotlinVersionIndex >= 0) {
      properties[kotlinVersionIndex].value = '1.9.25';
    } else {
      properties.push({ type: 'property', key: 'kotlinVersion', value: '1.9.25' });
    }
    
    // Add suppress flag
    const suppressIndex = properties.findIndex(p => p.type === 'property' && p.key === 'kotlin.compiler.suppressVersionCompatibilityCheck');
    if (suppressIndex >= 0) {
      properties[suppressIndex].value = 'true';
    } else {
      properties.push({ type: 'property', key: 'kotlin.compiler.suppressVersionCompatibilityCheck', value: 'true' });
    }
    
    return config;
  });
  
  // Patch react-settings-plugin build.gradle.kts
  config = withProjectBuildGradle(config, (config) => {
    const settingsPluginPath = path.join(config.modRequest.platformProjectRoot, 'react-settings-plugin', 'build.gradle.kts');
    if (fs.existsSync(settingsPluginPath)) {
      let content = fs.readFileSync(settingsPluginPath, 'utf8');
      content = content.replace(/kotlin\("jvm"\) version "1\.9\.\d+"/, 'kotlin("jvm") version "1.9.25"');
      fs.writeFileSync(settingsPluginPath, content);
    }
    return config;
  });
  
  return config;
};
