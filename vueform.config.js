import en from '@vueform/vueform/locales/en';
import tailwind from '@vueform/vueform/dist/tailwind';
import builder from '@vueform/builder/plugin';

import PreferencePlugin from './src/PreferencePlugin.js';

// Extending Tailwind classes so that our PreferenceElement
// will have the same classes for its alternative views
tailwind.classes = {
  ...tailwind.classes,
  RadioPreferenceElement_tabs: tailwind.classes.RadiogroupElement_tabs,
  RadioPreferenceElement_blocks: tailwind.classes.RadiogroupElement_blocks,
};

export default {
  theme: tailwind,
  locales: { en },
  locale: 'en',
  apiKey: 'z777-w4mz-nvt6-hr4n-yzow',
  plugins: [builder, PreferencePlugin],
};