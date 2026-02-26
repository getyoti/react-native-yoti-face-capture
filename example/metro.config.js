const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');
const pak = require('../package.json');
const root = path.resolve(__dirname, '..');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const modules = Object.keys({
  ...pak.peerDependencies,
});

const config = {
  projectRoot: __dirname,
  watchFolders: [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we blacklist them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blacklistRE: exclusionList([
      // Exclude peerDependencies from root node_modules
      ...modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
      ),
      // Exclude nested node_modules in the library
      new RegExp(
        `^${escape(
          path.join(
            __dirname,
            'node_modules',
            '@getyoti',
            'react-native-yoti-face-capture',
            'node_modules'
          )
        )}\\/.*$`
      ),
    ]),

    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
