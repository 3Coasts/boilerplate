module.exports = {
  version: '1',                       // Used for api version in uri
  environment: 'development',         // Can be 'development' || 'production;
  authTokenTimeout: 60000,            // Time before authTokens are deleted
  debug: true,                        // Used to print messages to console
  port: 3000,
  twilio: {},                         // Sid, token, number
  databases: {
    default: 'disk',
    disk: {
      filePath: '.tmp/'
    },
    mongo: {}                         // host, port, user, password, database
  },
  favicon: {
    files: {
      dest: './public/favicons',      // Folder to write the favicons `string`
      html: './lib/index.html',       // Path(s) to HTML file to write/append to. `string|array`
      iconsPath: '/favicons',         // Path for overriding default icons path. `string`
      androidManifest: null,          // Path for an existing android_chrome_manifest.json. `string`
      browserConfig: null,            // Path for an existing browserconfig.xml. `string`
      firefoxManifest: null,          // Path for an existing manifest.webapp. `string`
      yandexManifest: null            // Path for an existing yandex-browser-manifest.json. `string`
    },
    icons: {
      android: true,                  // Create Android homescreen icon. `boolean`
      appleIcon: true,                // Create Apple touch icons. `boolean`
      appleStartup: true,             // Create Apple startup images. `boolean`
      coast: true,                    // Create Opera Coast icon. `boolean`
      favicons: true,                 // Create regular favicons. `boolean`
      firefox: true,                  // Create Firefox OS icons. `boolean`
      opengraph: true,                // Create Facebook OpenGraph. `boolean`
      windows: true,                  // Create Windows 8 tiles. `boolean`
      yandex: true                    // Create Yandex browser icon. `boolean`
    },
    settings: {
      appName: 'Boilerplate',         // Your application's name. `string`
      appDescription: null,           // Your application's description. `string`
      developer: '3Coasts',           // Your (or your developer's) name. `string`
      developerURL: 'http://3Coasts.com',       // Your (or your developer's) URL. `string`
      version: 1.0,                   // Your application's version number. `number`
      background: null,               // Background colour for flattened icons. `string`
      index: null,                    // Path for the initial page on the site. `string`
      url: null,                      // URL for your website. `string`
      silhouette: false,              // Turn the logo into white silhouette for Windows 8 `boolean`
      logging: true                   // Print logs to console? `boolean`
    }
  }
};
