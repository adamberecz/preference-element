<template>
  <component :is="elementLayout" :multiple="true" ref="container">
    <template #element>
      <div :class="classes.wrapper" role="group" :aria-labelledby="labelId">
        <component
          :is="preferenceComponent"
          v-bind="preferenceComponentProps"
          name="value"
          ref="preference$"
        />

        <component
          v-for="(schema, i) in extendedPreferenceSchemas"
          name=""
          :is="schema.component"
          v-bind="schema"
        />
      </div>
    </template>

    <!-- Default element slots -->
    <template v-for="(component, slot) in elementSlots" #[slot]><slot :name="slot" :el$="el$"><component :is="component" :el$="el$"/></slot></template>
	</component>
</template>

<script>
import { ref, computed, toRefs, watch, inject } from 'vue'
import { ObjectElement } from '@vueform/vueform'
import { classes } from '@vueform/vueform/dist/tailwind'

export default {
  ...ObjectElement,
  name: 'PreferenceElement',
  props: {
    ...ObjectElement.props,

    preferenceType: {
      required: false,
      type: String,
      default: 'radio',
    },

    preferenceDefault: {
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
    extendedPreferences: {
      type: Array,
      required: false,
      default: () => ([]),
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
  },
  setup(props, context) {
    const {
      preferenceDefault,
      extendedPreferences,
      preferenceType,
      showChannel,
      channel,
      statement,
      trueValue,
      falseValue,
      items,
      onlyAllowOptOut,
      mode,
    } = toRefs(props)

    const element = ObjectElement.setup(props, context)
    const { path } = element

    const $vueform = inject('$vueform')

    // ================ DATA =================

    const preference$ = ref(null)

    const defaultClasses = ref({
      ...classes.ObjectElement,
    })

    // ============== COMPUTED ===============

    const preferenceComponent = computed(() => {
      let component = 'RadioPreferenceElement'

      if (preferenceType.value === 'checkbox') {
        component = 'CheckboxPreferenceElement'
      } 
      else if (preferenceType.value === 'toggle') {
        component = 'TogglePreferenceElement'
      }

      return component
    })

    const preferenceComponentProps = computed(() => {
      const props = {
        default: preferenceDefault.value,
        showChannel: showChannel.value,
        channel: channel.value,
        statement: statement.value,
      }

      if (preferenceType.value === 'radio') {
        props.items = items.value
        props.onlyAllowOptOut = onlyAllowOptOut.value
        props.mode = mode.value
      } else {
        props.trueValue = trueValue.value
        props.falseValue = falseValue.value
      }

      return props
    })

    const extendedPreferenceList = computed(() => {
      return $vueform.value.extendedPreferences
    })

    const extendedPreferenceSchemas = computed(() => {
      return extendedPreferences.value.map((p) => {
        let schema = {
          name: p.preference,
          conditions: [
            [`${path.value}.value`, 1]
          ]
        }

        if (p.label !== undefined) {
          schema.label = p.label
        }

        if (p.default !== undefined && p.hasDefault) {
          schema.default = p.default
        }

        if (p.type === 'select') {
          schema.component = 'SelectElement'
          schema.items = extendedPreferenceList.value[p.preference].options
        }
        else if (p.type === 'multiselect') {
          schema.component = 'TagsElement'
          schema.items = extendedPreferenceList.value[p.preference].options
        }
        else {
          schema.component = 'TextElement'
        }

        if (!p.showOnPage) {
          schema.component = 'HiddenElement'
          schema.meta = true

          delete schema.items
        }

        if (!p.userCanEdit) {
          schema.disabled = true
        }

        return schema
      })
    })

    watch(preferenceDefault, () => {
      preference$.value.update(preferenceDefault.value)
    })

    return {
      defaultClasses,
      ...element,
      preferenceComponent,
      preferenceComponentProps,
      preference$,
      extendedPreferenceSchemas,
    }
  }
}
</script>