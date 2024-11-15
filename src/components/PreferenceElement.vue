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
      name,
      formatLoad,
      submit,
      view,
    } = toRefs(props)

    const element = ObjectElement.setup(props, {
      // Added for warn-free HMR
      name: 'PreferenceElement',
      emits: ['change', 'remove', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeUnmount', 'unmounted'],
      ...context,
    })

    const {
      path,
      form$,
      available,
      children$,
      children$Array,
    } = element

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
        view: view.value,
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

        if (p.default !== undefined && (p.hasDefault || !p.showOnPage || !p.userCanEdit)) {
          schema.default = p.default
        }

        if (p.type === 'select') {
          schema.component = 'SelectElement'
          schema.items = $vueform.value.getExtendedPreferenceOptions(p.preference)
        }
        else if (p.type === 'multiselect') {
          schema.component = 'TagsElement'
          schema.items = $vueform.value.getExtendedPreferenceOptions(p.preference)
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

    const data = computed(() => {
      let data = {}
      
      children$Array.value.forEach((element$) => {
        if (!element$.available) {
          return
        }

        let elData

        if (element$.name === 'value') {
          elData = element$.data
        } else {
          elData = {
            extendedPreferences: [
              ...(data?.extendedPreferences || []),
            ]
          }

          elData.extendedPreferences.push({
            id: element$.name,
            name: $vueform.value.getExtendedPreference(element$.name)?.KeyName,
            value: Array.isArray(element$.value) ? element$.value : (element$.value ? [element$.value] : [])
          })
        }

        data = {
          ...data,
          ...elData,
        }
      })
      
      return { [name.value]: data }
    })
    
    const requestData = computed(() => {
      if (!available.value || !submit.value) {
        return {}
      }
      
      return data.value
    })
  
    // =============== METHODS ===============

    const setData = (val, action = 'load') => {
      const value = val.value || 0
      const extendedPreferences = val.extendedPreferences || []

      children$.value.value.load(value)

      extendedPreferenceSchemas.value.forEach((schema) => {
        const type = schema.component.toLowerCase().replace('element', '')
        const epData = extendedPreferences.find(ep => ep.id == schema.name) || {}
        const epValue = type === 'tags' ? (epData.value || []) : (epData.value?.[0] || null)
        const el$ = children$.value[schema.name]

        if ((Array.isArray(epValue) && epValue.length) || (!Array.isArray(epValue) && epValue !== null)) {
          el$[action](epValue)
        } else if (action === 'load') {
          el$.clear()
        }
      })
    }
    
    const load = (val, format = false) => {
      let formatted = format && formatLoad.value ? formatLoad.value(val, form$.value) : val

      setData(formatted)
    }
    
    const update = (val) => {
      setData(val, 'update')
    }

    watch(preferenceDefault, () => {
      preference$.value.update(preferenceDefault.value)
    })

    return {
      defaultClasses,
      ...element,
      data,
      requestData,
      load,
      update,
      preferenceComponent,
      preferenceComponentProps,
      preference$,
      extendedPreferenceSchemas,
    }
  }
}
</script>