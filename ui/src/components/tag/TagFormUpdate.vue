<template>
  <fragment>
    <v-list-item-icon class="mr-0">
      <v-icon
        left
        data-test="edit-icon"
        v-text="'mdi-tag'"
      />
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title
        class="text-left"
        data-test="edit-title"
        v-text="hasTag ? 'Edit tags': 'Add tags'"
      />
    </v-list-item-content>

    <v-dialog
      v-model="showDialog"
      max-width="400"
      @click:outside="close"
    >
      <v-card data-test="tagForm-card">
        <v-card-title
          class="headline primary"
          v-text="'Manage Tags'"
        />

        <v-card-text>
          <v-combobox
            id="targetInput"
            ref="tags"
            v-model="listTagLocal"
            label="Tag"
            hint="Maximum of 3 tags"
            multiple
            chips
            append-icon
            data-test="deviceTag-combobox"
            :deletable-chips="true"
            :rules="[tagRule]"
            :delimiters="[',', ' ']"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            data-test="close-btn"
            @click="close"
            v-text="'Close'"
          />

          <v-btn
            text
            data-test="save-btn"
            @click="save()"
            v-text="'Save'"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </fragment>
</template>

<script>

export default {
  name: 'TagFormDialogComponent',

  props: {
    deviceUid: {
      type: String,
      required: true,
    },

    tagsList: {
      type: Array,
      required: true,
    },

    show: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
      listTagLocal: [],
      errorMsg: '',
    };
  },

  computed: {
    showDialog: {
      get() {
        return this.show;
      },

      set(value) {
        this.$emit('update:show', value);
      },
    },

    hasTag() {
      return this.tagsList.length > 0;
    },
  },

  watch: {
    showDialog(value) {
      if (value) {
        this.setLocalVariable();
      }
    },

    listTagLocal(list) {
      if (list.length > 3) {
        this.$nextTick(() => this.listTagLocal.pop());
        this.errorMsg = 'The maximum capacity has reached.';
      }
    },
  },

  async created() {
    await this.setLocalVariable();
  },

  methods: {
    tagRule() {
      if (this.errorMsg !== '') {
        return this.errorMsg;
      }

      return true;
    },

    setLocalVariable() {
      this.listTagLocal = this.tagsList;
      this.errorMsg = '';
    },

    async save() {
      await this.$refs.tags.blur();

      const data = { uid: this.deviceUid, tags: this.listTagLocal };

      try {
        this.errorMsg = '';
        await this.$store.dispatch('devices/updateDeviceTag', data);
        await this.$store.dispatch('tags/setTags', {
          data: data.tags,
          headers: {
            'x-total-count': data.tags.length,
          },
        });
        this.$store.dispatch('snackbar/showSnackbarSuccessAction', this.$success.deviceTagUpdate);

        this.update();
      } catch (error) {
        this.listTagLocal = this.tagsList;

        switch (true) {
        // when the name the format is invalid.
        case (error.response.status === 400): {
          this.errorMsg = 'The format is invalid. Min 3, Max 255 characters!';
          break;
        }
        // when the user is not authorized.
        case (error.response.status === 403): {
          this.$store.dispatch('snackbar/showSnackbarErrorAction', this.$errors.snackbar.deviceTagUpdate);
          break;
        }
        // When the array tag size reached the max capacity.
        case (error.response.status === 406): {
          this.errorMsg = 'The maximum capacity has reached.';
          break;
        }
        default: {
          this.$store.dispatch('snackbar/showSnackbarErrorAction', this.$errors.snackbar.deviceTagUpdate);
        }
        }
      }
      return false;
    },

    update() {
      this.$emit('update');
      this.close();
    },

    close() {
      this.$emit('update:show', false);
    },
  },
};
</script>
