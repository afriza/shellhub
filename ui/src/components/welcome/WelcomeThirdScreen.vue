<template>
  <fragment>
    <div class="pa-4">
      <p class="mb-4">
        A device connection has been detected.
      </p>
      <p class="mb-4">
        Please confirm that this device is yours to enroll into your account. After confirmation,
        you will go to the last step of introducing <strong>ShellHub</strong>.
      </p>

      <v-row no-gutters>
        <v-col>
          <v-card
            class="pa-2"
            tile
            :elevation="0"
          >
            <strong>Hostname</strong>
          </v-card>
          <v-card
            class="pa-2"
            tile
            :elevation="0"
            data-test="deviceName-field"
          >
            {{ getPendingDevice.name }}
          </v-card>
        </v-col>
        <v-col>
          <v-card
            class="pa-2"
            tile
            :elevation="0"
          >
            <strong>Operation System</strong>
          </v-card>
          <v-card
            class="pa-2"
            tile
            :elevation="0"
            data-test="devicePrettyName-field"
          >
            <div
              v-if="getPendingDevice.info"
            >
              <DeviceIcon
                :icon-name="getPendingDevice.info.id"
              />
              {{ getPendingDevice.info.pretty_name }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </fragment>
</template>

<script>

import DeviceIcon from '@/components/device/DeviceIcon';

export default {
  name: 'WelcomeThirdScreenComponent',

  components: {
    DeviceIcon,
  },

  computed: {
    getPendingDevice() {
      return this.$store.getters['devices/getFirstPending'];
    },
  },

  created() {
    try {
      this.$store.dispatch('devices/setFirstPending');
    } catch {
      this.$store.dispatch('snackbar/showSnackbarErrorLoading', this.$errors.snackbar.devicePending);
    }
  },
};

</script>
