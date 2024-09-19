<script>
/**
 * Here we are creating a copy of the existing CheckboxElement and customize it. Base on this:
 * https://vueform.com/docs/creating-elements#copy-element
 */

import { ref, computed, toRefs, inject, reactive } from 'vue';
import { defineElement, CheckboxElement } from '@vueform/vueform';
import useA11y from '@vueform/vueform/src/composables/elements/useA11y';
import useText from '@vueform/vueform/src/composables/elements/useText';
import {
  CheckboxElement as CheckboxElementTemplate,
  classes,
} from '@vueform/vueform/dist/tailwind';

// Removing text & label from props
const { text, label, ...props } = CheckboxElement.props

export default defineElement({
  ...CheckboxElement, // adding props, mixins, emits
  ...CheckboxElementTemplate, // this is required even that we have the <template> defined
  name: 'CheckboxPreferenceElement',
  props: {
    // Adding existing RadigroupElement props
    ...props,

    // Overriding existing props
    presets: {
      required: false,
      type: [Array],
      default: () => ([
        'preference-element',
      ])
    },
    default: {
      required: false,
      type: [String, Number],
      default: 0,
    },
    trueValue: {
      required: false,
      type: [Boolean, String, Number],
      default: 1
    },
    falseValue: {
      required: false,
      type: [Boolean, String, Number],
      default: 0
    },

    // Adding new props
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
  },
  setup(props, context) {
    // The original element instance with all props and methods
    const element = CheckboxElement.setup(props, context);

    // Deconstructing the props
    const {
      showChannel,
      channel,
      statement,
    } = toRefs(props);

    // Injecting the global configuration object
    const $vueform = inject('$vueform')

    // Setting the default classes based on CheckboxElement
    const defaultClasses = ref({
      ...classes.CheckboxElement,
    });

    // Making the `label` a computed prop instead of a regular prop/option
    const label = computed(() => {
      return !showChannel.value ? undefined : $vueform.value.getChannel(channel.value)?.label
    })

    // Making the `text` a computed prop instead of a regular prop/option
    const text = computed(() => {
      return $vueform.value.getStatement(statement.value)?.label
    })

    // Overriding `hasLabel` computed prop to make sure our label shows up
    // https://github.com/vueform/vueform/blob/main/src/composables/elements/useLabel.js#L28
    const hasLabel = computed(() => {
      return showChannel.value && channel.value !== null && channel.value !== undefined
    })

    // Some composables of the original `CheckboxElement` rely on the `text` prop.
    // As we replace `text` prop with a computed prop we need to make it available
    // to composables as if it was a regular prop and re-export them.
    // https://github.com/vueform/vueform/blob/main/src/components/elements/CheckboxElement.js#L112
    // https://github.com/vueform/vueform/blob/main/src/components/elements/CheckboxElement.js#L115
    const a11yUse = useA11y(reactive({
      ...props,
      text,
    }), context, element)

    const textUse = useText(reactive({
      ...props,
      text,
    }), context, element)

    return {
      defaultClasses,
      ...element,
      hasLabel,
      label,
      text,
      ...a11yUse,
      ...textUse,
    };
  },
});
</script>
