import '@vueform/builder/index.css';
import { TypeField, BaseElementField } from '@vueform/builder';
import { nextTick } from 'vue';
import theme from './theme.config.js';

const ViewField = class extends BaseElementField {
  get schema() {
    return {
      view: {
        type: 'radiogroup',
        presets: ['tabs-tiny', 'tabs-3'],
        view: 'tabs',
        label: 'View',
        items: {
          default: 'Default',
          tabs: 'Tabs',
          blocks: 'Blocks',
        },
        default: 'default',
        columns: {
          label: 5,
        },
      },
    };
  }
};

const ChannelField = class extends BaseElementField {
  name = 'ChannelField';

  lastSelectedElement;

  get schema() {
    const channels = this.unusedChannels.map((channel) => ({
      value: channel.value,
      label: channel.label,
    }));

    return {
      channel: {
        type: 'select',
        label: 'Channel',
        columns: { label: 3 },
        floating: false,
        search: true,
        placeholder: 'Select a channel',
        presets: ['prop-multiline'],
        items: channels,
        onChange: (newValue, oldValue, el$) => {
          const statement$ = el$.form$.el$(`${this.section}.statement`);

          this.setStatementOptions(el$.value, statement$);

          // In the builder the @change event is triggered when the element options are loaded.
          // To differentiate between a change event that is triggered by loading the panel and
          // the user actually changing the field value we can use `this.isLoading` prop.
          if (!this.isLoading) {
            // By default element data is saved in change event if it is not a panel loading event.
            // Since we are overriding the `onChange` method, we need to handle this manualy.
            this.save(newValue, oldValue, el$.name, el$);

            // If the statement list only contains a single item, select that by default.
            if (statement$.input.resolvedOptions.length === 1) {
              // Updated options require an extra tick to be properly selected
              nextTick(() => {
                statement$.update(statement$.input.resolvedOptions[0].value);
              });

              // ...otherwise clear the element value
            } else {
              statement$.clear();
            }
          }
        },

        // Acts as a watcher, that detects switching between selected elements.
        // It refreshes the statement list if the switch happened between two
        // elements having the same channel, because no onChange event is being
        // triggered on `channel` element which would set the statement list.
        onUpdated: (el$) => {
          if (this.lastSelectedElement !== this.selectedElement) {
            this.lastSelectedElement = this.selectedElement;
            this.setStatementOptions(
              el$.value,
              el$.form$.el$(`${this.section}.statement`)
            );
          }
        },
      },
    };
  }

  /**
   * Returns the channels which don't exist at any other preference element.
   *
   * @returns {array}
   */
  get unusedChannels() {
    const preferenceFields = this.preferenceFields;

    // Filter out channels that already exist outside of the currently selected element
    return this.$vueform.channels.filter((channel) => {
      const existingFieldWithChannel = preferenceFields.find(
        (field) => field.channel === channel.value
      );

      return (
        !existingFieldWithChannel ||
        existingFieldWithChannel.path === this.selectedElement
      );
    });
  }

  /**
   * Returns the list of `preference` type element schemas from the form.
   *
   * @returns {array}
   */
  get preferenceFields() {
    return this.getPreferenceFields(this.schemaComputed.value);
  }

  /**
   * Sets the options for `statement` selector based on a channel.
   *
   * @param {number} channel* - the id (value) of the channel
   * @param {Component} statement$* - the instance of `statement` select element
   * @returns {void}
   */
  setStatementOptions(channel, statement$) {
    // Directly overriding the options of the statements select
    // using the underlying Multiselect's resolvedOptions prop.
    statement$.input.resolvedOptions =
      this.getUnusedStatementsForChannel(channel);
    statement$.input.refreshLabels();
  }

  /**
   * Returns the statements for a channel which aren't used for any other preference element.
   *
   * @param {number} channel* - the id (value) of the channel
   * @returns {array}
   */
  getUnusedStatementsForChannel(channel) {
    const preferenceFields = this.preferenceFields;

    return this.$vueform.getStatements(channel).filter((statement) => {
      const existingFieldWithStatement = preferenceFields.find(
        (field) => field.statement === statement.value
      );

      return (
        !existingFieldWithStatement ||
        existingFieldWithStatement.path === this.selectedElement
      );
    });
  }

  /**
   * Returns an array of `preference` type element schemas within a schema.
   *
   * @param {object|array} schema* - the schema structure in which the elements should be searched
   * @param {string} prefix - the prefix to be used for element path when being added to the array
   * @returns {array}
   */
  getPreferenceFields(schema, prefix = '') {
    if (!schema) {
      return [];
    }

    if (!Array.isArray(schema)) {
      schema = Object.values(schema);
    }

    const collection = [];

    schema.forEach((item) => {
      const path = prefix ? `${prefix}.${item.name}` : item.name;

      // If it is a `*-preference` type add it to the list
      if (
        item.type == 'radio-preference' ||
        item.type == 'checkbox-preference' ||
        item.type == 'toggle-preference'
      ) {
        collection.push({
          ...item,
          path,
        });
      }

      // If it is a container element add `preference` type children recursively
      if (item.type === 'object' || item.type === 'group') {
        collection.push(...this.getPreferenceFields(item.schema, path));
      }
    });

    return collection;
  }
};

const StatementField = class extends BaseElementField {
  name = 'StatementField';

  get schema() {
    const channels = this.$vueform.channels;

    return {
      statement: {
        type: 'select',
        label: 'Statement',
        columns: { label: 3 },
        floating: false,
        search: true,
        allowAbsent: true,
        placeholder: 'Select a statement',
        noOptionsText:
          'The list is empty (you might need to select a Channel first)',
        presets: ['prop-multiline'],
        items: [],
      },
    };
  }
};

const IdField = class extends BaseElementField {
  name = 'IdField';

  // Watch for changes of label and description
  // and update the ID if any of them change.
  watchers = {
    [`${this.section}.id`]: [
      [
        ['channel', 'statement'],
        async (el$, [channelValue, statementValue]) => {
          const ids = [channelValue || '', statementValue || ''];

          el$.update(ids.join('|'));
        },
      ],
    ],
  };

  get schema() {
    return {
      id: {
        type: 'hidden',
        meta: true,
      },
    };
  }
};

const DefaultField = class extends BaseElementField {
  name = 'DefaultField';

  // Watch for changes of label and description
  // and update the ID if any of them change.
  watchers = {
    [`${this.section}.default`]: [
      [
        ['mode', 'onlyAllowOptOut'],
        async (el$, [mode, onlyAllowOptOut]) => {
          // Update the default value in `binary` mode when opt in is possible as it has no `No change` option
          el$.update(mode === 'binary' && !onlyAllowOptOut ? null : 2);
        },
      ],
    ],
  };

  get schema() {
    return {
      default: {
        type: 'hidden',
        meta: true,
      },
    };
  }
};

const OnlyAllowOptOutField = class extends BaseElementField {
  name = 'OnlyAllowOptOutField';

  get schema() {
    return {
      onlyAllowOptOut: {
        type: 'radiogroup',
        label: 'Only allow opt out',
        default: 0,
        columns: { label: 8 },
        items: [
          { value: 1, label: 'On' },
          { value: 0, label: 'Off' },
        ],
        presets: ['tabs-tiny', 'tabs-2'],
        view: 'tabs',
      },
    };
  }
};

const ShowChannelField = class extends BaseElementField {
  name = 'ShowChannelField';

  get schema() {
    return {
      showChannel: {
        type: 'radiogroup',
        label: 'Show channel name',
        default: 1,
        columns: { label: 8 },
        items: [
          { value: 1, label: 'On' },
          { value: 0, label: 'Off' },
        ],
        presets: ['tabs-tiny', 'tabs-2'],
        view: 'tabs',
      },
    };
  }
};

const ModeField = class extends BaseElementField {
  name = 'ModeField';

  get schema() {
    return {
      mode: {
        type: 'radiogroup',
        default: 'binary',
        addClass: 'mb-2',
        items: [
          { value: 'binary', label: 'Binary' },
          { value: 'trinary', label: 'Trinary' },
        ],
        presets: ['tabs-tiny', 'tabs-2'],
        view: 'tabs',
      },
    };
  }
};

const ItemsField = class extends BaseElementField {
  name = 'ItemsField';

  get schema() {
    return {
      subtitle_items: {
        type: 'static',
        content: 'Options',
        presets: ['prop-subtitle'],
      },
      items: {
        type: 'list',
        default: [
          {
            value: 1,
            displayLabel: 'Opt in',
            label: 'Opt In',
          },
          {
            value: 0,
            displayLabel: 'Opt out',
            label: 'Opt Out',
          },
          {
            value: 2,
            displayLabel: 'No change',
            label: 'No Change',
          },
        ],
        sort: true,
        controls: {
          add: false,
          remove: false,
          sort: true,
        },
        addClasses: {
          ListElement: {
            handle: '!left-32',
          },
        },
        object: {
          schema: {
            value: {
              type: 'hidden',
              meta: true,
            },
            displayLabel: {
              type: 'text',
              readonly: true,
              columns: 5,
              addClasses: {
                TextElement: {
                  inputContainer: '!border-0 !bg-transparent !pl-0',
                  input_sm: '!pl-0',
                },
              },
            },
            label: {
              type: 'text',
              columns: 7,
              placeholder: 'Label',
              floating: false,
            },
          },
        },
      },
    };
  }

  save(value, old, key, el$) {
    const update = {};
    const remove = [];

    // If it's in the default state, remove the `items` prop
    if (
      [0, 1, 2].every(
        (i) => value[i].label === this.schema.items.default[i].label
      )
    ) {
      remove.push('items');

      // Otherwise sanitize the items (rm `displayLabel`)
    } else {
      update.items = value.map((i) => ({
        value: i.value,
        label: i.label,
      }));
    }

    this.update(update, remove);
  }

  load(data) {
    const load = {};
    const labelMap = this.schema.items.default.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.value]: curr.label,
      }),
      {}
    );

    // If `items` are loaded set their `displayLabel`
    if (data.items) {
      load.items = data.items.map((i) => ({
        ...i,
        displayLabel: labelMap[i.value],
      }));

      // Otherwise load the default items
    } else {
      load.items = this.schema.items.default;
    }

    return load;
  }
};

export default {
  theme,
  openOnAdd: true,
  devices: [],
  darkMode: [],
  elements: [
    'radioPreference',
    'checkboxPreference',
    'togglePreference',
    'container',
    'divider',
  ],
  element: {
    types: {
      radioPreference: {
        label: 'Radio Preference',
        description: 'Channel preference using radio',
        icon: ['fas', 'dot-circle'],
        category: 'fields',
        rules: [],
        schema: {
          type: 'radio-preference',
          builder: {
            clone: false,
          },
        },
        sections: {
          properties: {
            name: 'properties',
            label: 'Layout',
            fields: {
              type: { type: TypeField },
              id: { type: IdField },
              default: { type: DefaultField },
              view: { type: ViewField },
              channel: { type: ChannelField },
              statement: { type: StatementField },
              mode: { type: ModeField },
              onlyAllowOptOut: { type: OnlyAllowOptOutField },
              showChannel: { type: ShowChannelField },
              items: { type: ItemsField },
            },
          },
        },
        separators: {
          properties: [
            ['type', 'id', 'default', 'view'],
            ['channel', 'statement'],
            ['mode', 'onlyAllowOptOut', 'showChannel'],
            ['items'],
          ],
        },
      },
      checkboxPreference: {
        label: 'Checkbox Preference',
        description: 'Channel preference using checkbox',
        icon: ['fas', 'check-square'],
        category: 'fields',
        rules: [],
        schema: {
          type: 'checkbox-preference',
          builder: {
            clone: false,
          },
        },
        sections: {
          properties: {
            name: 'properties',
            label: 'Layout',
            fields: {
              type: { type: TypeField },
              id: { type: IdField },
              channel: { type: ChannelField },
              statement: { type: StatementField },
              showChannel: { type: ShowChannelField },
            },
          },
        },
        separators: {
          properties: [['type', 'id', 'channel', 'statement'], ['showChannel']],
        },
      },
      togglePreference: {
        label: 'Toggle Preference',
        description: 'Channel preference using toggle',
        icon: ['fas', 'toggle-on'],
        category: 'fields',
        rules: [],
        schema: {
          type: 'toggle-preference',
          builder: {
            clone: false,
          },
        },
        sections: {
          properties: {
            name: 'properties',
            label: 'Layout',
            fields: {
              type: { type: TypeField },
              id: { type: IdField },
              channel: { type: ChannelField },
              statement: { type: StatementField },
              showChannel: { type: ShowChannelField },
            },
          },
        },
        separators: {
          properties: [['type', 'id', 'channel', 'statement'], ['showChannel']],
        },
      },
    },
  },
};
