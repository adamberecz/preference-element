<template>
  <BuilderModal
    title="Extended Preferences"
    @close="handleClose"
  >
    <Vueform v-bind="form" ref="form$" @submit="handleSubmit" />
  </BuilderModal>
</template>

<script setup>
import { ref, inject, onMounted, } from 'vue'

// ============= DEFINITIONS =============

const emit = defineEmits([
  'close'
])

const { builder$ } = defineProps({
  builder$: {
    type: Object,
    required: true,
  }
})

// =============== INJECT ================

const $vueform = inject('$vueform')

// ================ DATA =================

const form$ = ref(null)

const form = ref({
  endpoint: false,
  schema: {
    extendedPreferences: {
      type: 'list',
      object: {
        schema: {
          type: {
            type: 'select',
            items: Object.keys($vueform.value.extendedPreferences).reduce((prev, curr) => ({
              ...prev,
              [curr]: $vueform.value.extendedPreferences[curr].label,
            }), {})
          }
        }
      }
    },
    save: {
      type: 'button',
      submits: true,
      buttonLabel: 'Save',
    }
  },
})

// =============== METHODS ===============

const handleSubmit = (form$) => {
  builder$.updateBuilder('schema', {
    extendedPreferences: form$.data.extendedPreferences,
  }, {
    path: builder$.selectedElement
  })

  builder$.refreshConfigPanel(builder$.schema)

  emit('close')
}

const handleClose = () => {
  emit('close')
}

// ================ HOOKS ================

onMounted(() => {
  form$.value.load({
    extendedPreferences: builder$.selectedElementSchema.extendedPreferences
  })
})

</script>