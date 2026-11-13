import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import { generateMetadata, writeImportMap } from '@sitecore-content-sdk/nextjs/tools';
import scConfig from './sitecore.config';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      generateMetadata(),
      writeImportMap({ paths: ['src/components'] }),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    exclude: ['src/components/content-sdk/*', 'src/components/ui/*'],
  },
});
