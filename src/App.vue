<template>
  <div class="h-screen">
    <VueformBuilder />
    <!-- <div class="w-full flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-box px-10 py-10 w-[420px] mx-auto mt-10 relative">
        <Vueform ref="form$" v-bind="form" />
        <br/>
        <pre>
          {{ form$?.requestData }}
        </pre>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form$ = ref(null)

const form = ref({
  schema: {
    a: {
      type: 'preference',
      extendedPreferences: [
        {
          type: 'frequency',
          showOnPage: true,
          element: 'select',
          label: 'How often?',
          userCanEdit: true,
          default: 'Weekly'
        },
        {
          type: 'size',
          showOnPage: true,
          element: 'multiselect',
          label: 'Size?',
          userCanEdit: true,
          default: ['Medium']
        },
        {
          type: 'color',
          showOnPage: true,
          element: 'text',
          label: 'Color?',
          userCanEdit: true,
        },
      ]
    },
  }
})

</script>
