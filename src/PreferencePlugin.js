
import RadioPreferenceElement from './components/RadioPreferenceElement.vue';
import CheckboxPreferenceElement from './components/CheckboxPreferenceElement.vue';
import TogglePreferenceElement from './components/TogglePreferenceElement.vue';

export default {
  // Adding a preset to make sure tabs are
  // the same with with 2 or 3 options.
  config(config) {
    config.presets = {
      ...config.presets,
      'equal-width-tabs': {
        addClasses: (form$, el$, comp$) => ({
          // Making sure tabs are always the same width
          RadioPreferenceElement: {
            wrapper: 'grid-cols-12',
          },
          RadiogroupRadio: {
            container: [
              'text-center',
              el$.preferenceOptions.length === 3 ? 'col-span-4' : 'col-span-6',
            ],
          },
        }),
      },
      'preference-element': {
        addClasses: {
          ElementLabel: {
            // Making sure the label takes up the whole space, because
            // because its with would be calculated based on the `label`
            // prop (regular) that is overridden with a computed prop.
            container_md: 'col-span-12',
          },
          ElementText: {
            // Styling the `before` text to match design
            container_before: 'mb-2 -mt-1 text-sm text-gray-500 dark:text-dark-400',
          },
        }
      },
    };

    config.elements = [
      ...(config.elements || []),
      RadioPreferenceElement,
      CheckboxPreferenceElement,
      TogglePreferenceElement,
    ]
  },

  // Setting the channels in the globally available config
  // object in case they are needed elsewhere in the project.
  install(app, $vueform) {
    $vueform.channels = [
      {
        value: 1,
        label: 'Right To Be Forgotten',
        statements: [
          {
            value: 1,
            label: 'Right To Be Forgotten',
          },
        ],
      },
      {
        value: 2,
        label: 'Email',
        statements: [
          {
            value: 2,
            label: 'I agree to be contacted by Email',
          },
        ],
      },
      {
        value: 3,
        label: 'SMS',
        statements: [
          {
            value: 3,
            label: 'I agree to be contacted by SMS',
          },
          {
            value: 4,
            label: 'This is a statement',
          },
        ],
      },
      {
        value: 4,
        label: 'Mail',
        statements: [
          {
            value: 5,
            label: 'I agree to be contacted by Mail',
          },
        ],
      },
      {
        value: 5,
        label: 'Telephone',
        statements: [
          {
            value: 6,
            label: 'I agree to be contacted by Telephone',
          },
        ],
      },
      {
        value: 6,
        label: 'Lorum Preferences (LX)',
        statements: [
          {
            value: 7,
            label: 'Please tick here to accept all communications related to Lorum',
          },
          {
            value: 8,
            label: 'Click here to opt out from all Lorum emails',
          },
        ],
      },
      {
        value: 7,
        label: 'Ipsom Preferences (IX)',
        statements: [
          {
            value: 9,
            label: 'Please tick here to accept all communications related to Consumer',
          },
          {
            value: 10,
            label: 'Click here to opt out from all Ipsom emails',
          },
        ],
      },
      {
        value: 8,
        label: 'Transactional Communications',
        statements: [
          {
            value: 11,
            label: 'Important, need-to-know communications like Terms of Service updates, password resets, reports you’ve requested, or local app outages. You’ll get these emails no matter what.',
          },
        ],
      },
      {
        value: 9,
        label: 'Transactional Communications',
        statements: [
          {
            value: 12,
            label: 'Receive updates about your order.',
          },
        ],
      },
      {
        value: 10,
        label: 'Reminders',
        statements: [
          {
            value: 13,
            label: 'Receive timely reminders about actions you’ve taken on Cassie including items you have in your cart and recent orders.',
          },
        ],
      },
      {
        value: 11,
        label: 'Ipsom Research',
        statements: [
          {
            value: 14,
            label: 'Receive notifications about surveys to participate in and tell us about your experience.',
          },
        ],
      },
      {
        value: 12,
        label: 'Cassie Offers',
        statements: [
          {
            value: 15,
            label: 'Receive notifications about exclusive promotions and offers that can be applied to multiple stores.',
          },
        ],
      },
      {
        value: 13,
        label: 'News and Product updates',
        statements: [
          {
            value: 16,
            label: 'Receive notifications about new Cassie products, features, and news.',
          },
        ],
      },
      {
        value: 14,
        label: 'Product updates',
        statements: [
          {
            value: 17,
            label: 'New products for your business or helpful updates to products you already use. ',
          },
        ],
      },
      {
        value: 15,
        label: 'Surveys and Feedback',
        statements: [
          {
            value: 18,
            label: 'Help us serve you better by giving us honest feedback about your experience (the occasional chance to win a gift card is a nice bonus too!)',
          },
        ],
      },
      {
        value: 16,
        label: 'Special Offers',
        statements: [
          {
            value: 19,
            label: 'Exclusive, one-time offers like extended free trials, commission discounts, and more.',
          },
        ],
      },
      {
        value: 17,
        label: 'Account Support and Education',
        statements: [
          {
            value: 20,
            label: 'Educational guides and personalized communications to help you grow your business.',
          },
        ],
      },
      {
        value: 18,
        label: 'Performance Reporting and Insights',
        statements: [
          {
            value: 21,
            label: 'Data you can use to grow and improve, like performance updates, customer feedback, and customized menu insights.',
          },
        ],
      },
      {
        value: 19,
        label: 'Sales Information',
        statements: [
          {
            value: 22,
            label: 'Personalized, one-to-one recommendations and support from our Sales team about new features and products.',
          },
        ],
      },
      {
        value: 20,
        label: 'Merchant Preferences (MX)',
        statements: [
          {
            value: 23,
            label: 'Please tick here to accept all communications related to Merchant',
          },
          {
            value: 24,
            label: 'Click here to opt out from all Merchant emails',
          },
        ],
      },
      {
        value: 21,
        label: 'Transactional Communications',
        statements: [
          {
            value: 25,
            label: 'Important, need-to-know communications like Terms of Service updates, password resets, information about your deliveries, or local app outages. You’ll get these emails no matter what.',
          },
        ],
      },
      {
        value: 22,
        label: 'Notifications and Reminders',
        statements: [
          {
            value: 26,
            label: 'Important reminders for things like scheduled shifts.',
          },
        ],
      },
      {
        value: 23,
        label: 'Surveys & Feedback',
        statements: [
          {
            value: 27,
            label: 'Help us serve you better by giving us honest feedback about your experience (the occasional chance to win a gift card is a nice bonus too!)',
          },
        ],
      },
      {
        value: 24,
        label: 'Newsletter and Digests',
        statements: [
          {
            value: 28,
            label: 'Company news and Lorum-only updates like the monthly Lorum Digest.',
          },
        ],
      },
      {
        value: 25,
        label: 'Special Offers and Promotions',
        statements: [
          {
            value: 29,
            label: 'Exclusive offers like challenges, incentives, and more.',
          },
        ],
      },
      {
        value: 26,
        label: 'Product & App Feature Updates',
        statements: [
          {
            value: 30,
            label: 'New improvements or helpful updates to the Lorum app.',
          },
        ],
      },
      {
        value: 27,
        label: 'DOLOR  Preferences (DOLOR )',
        statements: [
          {
            value: 31,
            label: 'Please tick here to accept all communications related to DOLOR',
          },
          {
            value: 32,
            label: 'Click here to opt out from all DOLOR  emails',
          },
        ],
      },
      {
        value: 28,
        label: 'Transactional Communications',
        statements: [
          {
            value: 33,
            label: 'Important, need-to-know communications like Terms of Service updates, password resets, and if the app is down in your area. You’ll get these emails no matter what.',
          },
        ],
      },
      {
        value: 29,
        label: 'Surveys and Feedback',
        statements: [
          {
            value: 34,
            label: 'Help us serve you better by giving us honest feedback about your experience (the occasional chance to win a gift card is a nice bonus too!). ',
          },
        ],
      },
      {
        value: 30,
        label: 'Special offers',
        statements: [
          {
            value: 35,
            label: 'Exclusive discounts and promotions like $5 off your next order.',
          },
        ],
      },
      {
        value: 31,
        label: 'News and Product updates',
        statements: [
          {
            value: 36,
            label: 'Company news and new products and features we think you’d like.',
          },
        ],
      },
      {
        value: 32,
        label: 'Account Support and Education',
        statements: [
          {
            value: 37,
            label: 'Administrator-only support and guides on things like onboarding and employee adoption.',
          },
        ],
      },
    ];

    $vueform.getChannel = (channel) => {
      return $vueform.channels.find(c => c.value === channel)
    }

    $vueform.getStatements = (channel) => {
      return $vueform.channels.find(c => c.value === channel)?.statements || []
    }

    $vueform.getStatement = (statement, channel) => {
      return channel
        ? $vueform.channels.find(c => c.value === channel).find(s => s.value === statement)
        : $vueform.channels.find(c => c.statements.find(s => s.value === statement))?.statements.find(s => s.value === statement) || {}
    }
  },
};