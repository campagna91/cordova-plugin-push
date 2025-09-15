#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

module.exports = function(context) {
  const iosPath = path.join(context.opts.projectRoot, 'platforms/ios');
  if (!fs.existsSync(iosPath)) return;

  const appName = fs.readdirSync(iosPath).find(f => f.endsWith('.xcodeproj')).replace('.xcodeproj', '');
  const frameworksPath = path.join(iosPath, appName, 'Resources/Frameworks');
  const sourceDir = path.join(context.opts.plugin.dir, 'src/ios/privacy-manifests');

  const map = {
    'FirebaseCore.framework': 'FirebaseCore.xcprivacy',
    'FirebaseCoreDiagnostics.framework': 'FirebaseCoreDiagnostics.xcprivacy',
    'FirebaseInstallations.framework': 'FirebaseInstallations.xcprivacy',
    'FirebaseMessaging.framework': 'FirebaseMessaging.xcprivacy'
  };

  Object.entries(map).forEach(([framework, file]) => {
    const dest = path.join(frameworksPath, framework, 'PrivacyInfo.xcprivacy');
    const src = path.join(sourceDir, file);

    if (fs.existsSync(src) && fs.existsSync(path.dirname(dest))) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copiato ${file} in ${framework}`);
    } else {
      console.warn(`⚠️ Non trovato: ${framework} o ${file}`);
    }
  });
};
