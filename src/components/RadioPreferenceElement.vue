<template>
<component :is="elementLayout" ref="container">
  <template #element>
    <div
      :class="classes.wrapper"
      :aria-labelledby="labelId"
      role="radiogroup"
    >
      <!-- 
      Inclusion of the RadiogroupElement template is required because `preferenceOptions` are used
      instead of original `resolvedOptions` in the loop to be able to cleanly remove Opt In option.

      Otherwise it's the same:
      https://github.com/vueform/vueform/blob/main/themes/blank/templates/elements/RadiogroupElement.vue
      -->
      <RadiogroupRadio
        v-for="(item, index, key) in preferenceOptions"
        :items="preferenceOptions"
        :index="index"
        :item="item"
        :value="item.value"
        :key="item.value"
        :attrs="aria"
      >
        <template #default="scope">
          <slot name="radio" v-bind="scope" :el$="el$">
            <component :is="fieldSlots.radio" v-bind="scope" :el$="el$" />
          </slot>
        </template>
      </RadiogroupRadio>
    </div>
  </template>

  <!-- Default element slots -->
  <template v-for="(component, slot) in elementSlots" #[slot]><slot :name="slot" :el$="el$"><component :is="component" :el$="el$" /></slot></template>

</component>
</template>

<script>
/**
* Here we are creating a copy of the existing RadiogroupElement and customize it. Base on this:
* https://vueform.com/docs/creating-elements#copy-element
*/

import { ref, computed, toRefs, inject } from 'vue';
import { defineElement, RadiogroupElement } from '@vueform/vueform';
import {
RadiogroupElement as RadiogroupElementTemplate,
classes,
} from '@vueform/vueform/dist/tailwind';

// Removing label & before from props
const { before, label, ...props } = RadiogroupElement.props

export default defineElement({
...RadiogroupElement, // adding props, mixins, emits
...RadiogroupElementTemplate, // this is required even that we have the <template> defined
name: 'RadioPreferenceElement',
props: {
  // Adding existing RadigroupElement props
  ...props,

  // Overriding the default presets value
  presets: {
    required: false,
    type: [Array],
    default: () => ([
      'equal-width-tabs',
      'preference-element',
    ])
  },

  // Overriding the default default value
  default: {
    required: false,
    type: [String, Number],
    default: null,
  },

  // Overriding the default item set
  items: {
    required: false,
    type: [Array],
    default: () => [
      { value: 1, label: 'Opt In' },
      { value: 0, label: 'Opt Out' },
      { value: 2, label: 'No Change' },
    ],
  },

  // Adding a new props
  onlyAllowOptOut: {
    required: false,
    type: [Boolean, Number],
    deafult: 0,
  },
  showChannel: {
    required: false,
    type: [Boolean, Number],
    default: 1,
  },
  channel: {
    required: false,
    type: [Number],
    default: undefined,
  },
  statement: {
    required: false,
    type: [Number],
    default: undefined,
  },
  mode: {
    required: false,
    type: [String],
    default: 'binary',
  },
},
setup(props, context) {
  // The original element instance with all props and methods
  const element = RadiogroupElement.setup(props, context);

  // Deconstructing the props
  const {
    onlyAllowOptOut,
    showChannel,
    channel,
    statement,
    mode,
  } = toRefs(props);

  // Decustructing element props and methods
  const {
    resolvedOptions,
  } = element;

  // Injecting the global configuration object
  const $vueform = inject('$vueform')

  // Setting the default classes based on RadiogroupElement
  const defaultClasses = ref({
    ...classes.RadiogroupElement,
  });

  // Removing "Opt in" when disabled
  const preferenceOptions = computed(() => {
    let options = [...resolvedOptions.value];

    if (onlyAllowOptOut.value) {
      options = options.filter(o => o.value !== 1)
    } else if (mode.value === 'binary') {
      options = options.filter(o => o.value !== 2)
    }

    return options;
  });

  // Making the `label` a computed prop instead of a regular prop/option
  const label = computed(() => {
    return !showChannel.value ? undefined : $vueform.value.getChannel(channel.value)?.label
  })

  // Making the `before` a computed prop instead of a regular prop/option
  const before = computed(() => {
    return $vueform.value.getStatement(statement.value)?.label
  })

  // Overriding `hasLabel` computed prop to make sure our label shows up
  // https://github.com/vueform/vueform/blob/main/src/composables/elements/useLabel.js#L28
  const hasLabel = computed(() => {
    return showChannel.value && channel.value !== null && channel.value !== undefined
  })

  return {
    defaultClasses,
    ...element,
    hasLabel,
    preferenceOptions,
    label,
    before,
  };
},
});
</script>
