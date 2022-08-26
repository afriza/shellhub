<template>
  <v-dialog v-model="showWelcome" :retain-focus="false" persistent>
    <v-card max-width="800px">
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1"> Welcome </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="e1 > 2" step="2">
            Connecting device
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="e1 > 3" step="3">
            Authorizing device
          </v-stepper-step>

          <v-divider />

          <v-stepper-step step="4"> Finish </v-stepper-step>
        </v-stepper-header>
      </v-stepper>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-12" height="250px">
            <h1>World</h1>
            <p>this is the step 001</p>
          </v-card>
          <v-card-actions>
            <v-btn text @click="showWelcome = false"> Close </v-btn>
            <v-spacer />
            <v-btn color="primary" data-test="firstClick-btn" @click="e1 = 2">
              Next
            </v-btn>
          </v-card-actions>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-12" height="250px">
            <h1>World</h1>
            <p>this is the step 002</p>
          </v-card>
          <v-card-actions>
            <v-btn text @click="showWelcome = false"> Close </v-btn>
            <v-spacer />
            <v-btn color="primary" data-test="firstClick-btn" @click="() => {}">
              Next
            </v-btn>
          </v-card-actions>
        </v-stepper-content>
      </v-stepper-items>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const e1 = ref<number>(1);
    const showWelcome = computed(() => props.show);

    return {
      e1,
      showWelcome,
    };
  },
});
</script>
