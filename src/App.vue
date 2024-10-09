<template>
  <div class="h-screen">
    <VueformBuilder />
    <!-- Uncomment below to test loading/updating -->>
    <!-- <div class="w-full flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-box px-10 py-10 w-[1420px] mx-auto mt-10 relative">
        <Vueform ref="form$">
          <PreferenceElement
            name="radioPreference"
            preference-type="radio"
            :extended-preferences="[
              {
                preference: '2',
                showOnPage: true,
                type: 'select',
                label: 'a',
                userCanEdit: true,
                hasDefault: true,
                default: 'd2',
              },
              {
                preference: '3',
                showOnPage: true,
                type: 'multiselect',
                label: 'b',
                userCanEdit: true,
                hasDefault: true,
                default: [
                  'Seb Test 2',
                  'Value 1 - test 1 - update 2',
                ],
              },
              {
                preference: '1',
                showOnPage: true,
                type: 'text',
                label: 'c',
                userCanEdit: true,
                hasDefault: true,
                default: 'ccc',
              },
              {
                preference: '5',
                showOnPage: true,
                type: 'text',
                label: 'd',
                userCanEdit: true,
                hasDefault: true,
                default: 'ddd',
              },
            ]"
          />
        </Vueform>
        <br/>
        <pre>
          {{ form$?.requestData }}
        </pre>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const form$ = ref(null)

onMounted(() => {
  // Change .load to .update to test update method.
  // The difference between load and update is that load clears the values
  // of extended preference fields if they are not present among the loaded
  // value's extendedPreferences list, while update leaves them default.
  form$.value?.load({
  "radioPreference": {
    "value": 1,
    "extendedPreferences": [
      {
        "id": "2",
        "name": "ROB TESTING AGAIN ",
        "value": [
          "d4"
        ]
      },
      // {
      //   "id": "3",
      //   "name": "Seb Test with Rob",
      //   "value": [
      //     "Seb Test 2",
      //     "Seb test"
      //   ]
      // },
      {
        "id": "1",
        "name": "Seb Test Key 1",
        "value": [
          "ccc2"
        ]
      },
      {
        "id": "5",
        "name": "Seb Test Key 3 - Update 1",
        "value": [
          "ddd2"
        ]
      }
    ]
  }
}
)
})

</script>
