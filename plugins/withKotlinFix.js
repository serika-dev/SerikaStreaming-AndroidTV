const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Suppress Kotlin version compatibility check and set Kotlin version
 */
module.exports = function withKotlinFix(config) {
  return withGradleProperties(config, (config) => {
    const properties = config.modResults;
    
    // Set Kotlin version to 1.9.25
    properties.forEach((item) => {
      if (item.type === 'property' && item.key === 'kotlinVersion') {
        item.value = '1.9.25';
      }
    });
    
    // Add if not exists
    const hasKotlinVersion = properties.some(p => p.type === 'property' && p.key === 'kotlinVersion');
    if (!hasKotlinVersion) {
      properties.push({
        type: 'property',
        key: 'kotlinVersion',
        value: '1.9.25'
      });
    }
    
    // Add suppress flag as system property
    const hasSuppress = properties.some(p => p.type === 'property' && p.key === 'kotlin.compiler.suppressVersionCompatibilityCheck');
    if (!hasSuppress) {
      properties.push({
        type: 'property',
        key: 'kotlin.compiler.suppressVersionCompatibilityCheck',
        value: 'true'
      });
    }
    
    return config;
  });
};
