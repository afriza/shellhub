<template>
  <v-list-item
    @click="showDialog = true"
    v-bind="$props"
    :disabled="notHasAuthorization"
  >
    <div class="d-flex align-center">
      <v-list-item-avatar class="mr-2">
        <v-icon color="white"> mdi-play </v-icon>
      </v-list-item-avatar>

      <v-list-item-title data-test="mdi-information-list-item">
        Play Session
      </v-list-item-title>
    </div>
  </v-list-item>

  <v-dialog
    :max-width="1024"
    :min-width="500"
    :transition="false"
    v-model="showDialog"
  >
    <v-card class="bg-v-theme-surface">
      <v-card-title
        class="text-h5 pa-3 bg-primary d-flex justify-space-between align-center"
      >
        Watch Session
        <v-btn
          variant="text"
          data-test="close-btn"
          icon="mdi-close"
          @click="showDialog = false"
        />
      </v-card-title>
      <v-divider />

      <v-card-text class="mt-4 mb-0 pb-1">
        <div :ref="terminal" id="playTerminal" />
      </v-card-text>
      <v-spacer />
      <v-card-actions>
        <v-container>
          <v-row no-gutters>
            <v-col cols="2" sm="6" md="1">
              <div class="pt-4 ml-7">
                <v-icon
                  v-if="!paused"
                  variant="text"
                  icon="mdi-pause-circle"
                  class="pl-0"
                  color="primary"
                  rounded
                  size="x-large"
                  data-test="pause-icon"
                  @click="pauseHandler"
                />
                <v-icon
                  v-else
                  variant="text"
                  icon="mdi-play-circle"
                  class="pl-0"
                  color="primary"
                  rounded
                  size="x-large"
                  data-test="play-icon"
                  @click="pauseHandler"
                />
              </div>
            </v-col>

            <v-col cols="6" md="9">
              <div
                :elevation="0"
                class="pt-4 pl-9 mr-5 d-flex align-center"
                tile
              >
                <p class="mr-4">
                  {{ nowTimerDisplay }} - {{ endTimerDisplay }}
                </p>
                <v-slider
                  v-model="currentTime"
                  class="ml-0"
                  min="0"
                  :max="100"
                  hide-details
                  color="primary"
                  data-test="time-slider"
                  @change="changeSliderTime"
                  @mousedown="(previousPause = paused), (paused = true)"
                  @mouseup="paused = previousPause"
                />
              </div>
            </v-col>

            <v-col cols="6" md="2">
              <div :elevation="0">
                <v-select
                  :items="speedList"
                  v-model="defaultSpeed"
                  hide-details
                  prepend-icon="mdi-speedometer"
                  data-test="speed-select"
                  variant="underlined"
                  color="primary"
                  :update:modelValue="speedChange(defaultSpeed)"
                ></v-select>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUpdated,
  ref,
  watch,
} from "vue";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import moment from "moment";
import { useStore } from "../../store";
// import "moment-duration-format";
// import "xterm/css/xterm.css";

export default defineComponent({
  props: {
    uid: {
      type: String,
      required: true,
    },
    recorded: {
      type: Boolean,
      required: true,
    },
    notHasAuthorization: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update"],
  setup(props, ctx) {
    const showDialog = ref(false);
    const terminal = ref<any>(null);
    const currentTime = ref(0);
    const totalLength = ref(0);
    const endTimerDisplay = ref(0);
    const getTimerNow = ref(0);
    const paused = ref(false);
    const previousPause = ref(false);
    const sliderChange = ref(false);
    const speedList = ref([0.5, 1, 1.5, 2, 4]);
    const logs = ref([]);
    const frames = ref<any>([]);
    const defaultSpeed = ref(1);
    const transition = ref(false);
    const xterm = ref<any>();
    const fitAddon = ref<any>();
    const iterativeTimer = ref<any>();
    const iterativePrinting = ref<any>();

    const store = useStore();
    const length = computed(() => logs.value.length);
    const nowTimerDisplay = computed(() => getTimerNow.value);

    watch(showDialog, (value) => {
      if (!value) {
        close();
        showDialog.value = false;
      } else {
        displayDialog();
      }
    });

    onUpdated(() => {
      if (showDialog.value) {
        setSliderDiplayTime(currentTime.value);
      }
    });

    const openPlay = async () => {
      if (props.recorded) {
        // receive data
        await store.dispatch("sessions/getLogSession", props.uid);
        logs.value = store.getters["sessions/get"];
        console.log("logs", logs.value);
        totalLength.value = getSliderIntervalLength(null);
        setSliderDiplayTime(null);
        setSliderDiplayTime(currentTime.value);

        frames.value = createFrames();

        xterm.value = new Terminal({
          // instantiate Terminal
          cursorBlink: true,
          fontFamily: "monospace",
        });
        console.log("xterm", xterm.value);
        console.log("frames", frames.value);

        fitAddon.value = new FitAddon(); // load fit
        xterm.value.loadAddon(fitAddon.value); // adjust screen in container
        if (xterm.value.element) {
          xterm.value.reset();
        }
      }
    };

    const displayDialog = async () => {
      // await to change dialog for the connection
      try {
        await openPlay();
        showDialog.value = !showDialog.value;
        await nextTick().then(() => {
          connect();
        });
      } catch {
        store.dispatch(
          "snackbar/showSnackbarErrorLoading",
          "$errors.snackbar.sessionPlay"
        );
      }
    };

    const connect = async () => {
      xterm.value.open(document.getElementById("playTerminal"));
      fitAddon.value.fit();
      xterm.value.focus();
      print(0, logs.value);
      timer();
    };

    const getSliderIntervalLength = (timeMs: number | null) => {
      let interval;

      if (!timeMs) {
        // not params, will return metrics to max timelengtht
        // @ts-ignore
        const max = new Date(logs.value[length.value - 1].time);
        // @ts-ignore
        const min = new Date(logs.value[0].time);
        // @ts-ignore
        interval = max - min;
      } else {
        // it will format to the time argument passed
        interval = timeMs;
      }

      return interval;
    };

    const setSliderDiplayTime = (timeMs: number | null) => {
      const interval = getSliderIntervalLength(timeMs);
      const duration = moment.duration(interval, "milliseconds");

      // format according to how long
      let hoursFormat;
      if (duration.asHours() > 1) hoursFormat = "h";
      else hoursFormat = "";

      // @ts-ignore
      const displayTime = duration.format(`${hoursFormat}:mm:ss`, {
        trim: false,
      });

      if (timeMs) {
        endTimerDisplay.value = displayTime;
      } else {
        getTimerNow.value = displayTime;
      }
    };

    const createFrames = () => {
      // create cumulative frames for the exibition in slider
      let time = 0;
      let message = "";
      const arrFrames = [
        {
          // @ts-ignore
          incMessage: (message += logs.value[0].message),
          incTime: time,
        },
      ];

      for (let i = 1; i < logs.value.length; i += 1) {
        // @ts-ignore
        const future = new Date(logs.value[i].time);
        // @ts-ignore
        const now = new Date(logs.value[i - 1].time);
        // @ts-ignore
        const interval = moment.duration(future - now, "milliseconds").asMilliseconds();
        time += interval;
        // @ts-ignore
        message += logs.value[i].message;
        arrFrames.push({
          incMessage: message,
          incTime: time,
        });
      }
      return arrFrames;
    };

    const speedChange = (speed: number) => {
      defaultSpeed.value = speed;
      xtermSyncFrame(currentTime.value);
    };

    const timer = () => {
      // Increments the slider
      if (!paused.value) {
        if (currentTime.value >= totalLength.value) return;
        currentTime.value += 100;
      }
      iterativeTimer.value = setTimeout(
        timer.bind(null),
        100 * (1 / defaultSpeed.value)
      );
    };

    const changeSliderTime = () => {
      sliderChange.value = true;
      xtermSyncFrame(currentTime.value);
    };

    const pauseHandler = () => {
      paused.value = !paused.value;
      xtermSyncFrame(currentTime.value);
    };

    const close = () => {
      transition.value = true;
      if (xterm.value) xterm.value.dispose();
      clear();
      currentTime.value = 0;
      paused.value = false;
      defaultSpeed.value = 1;

      ctx.emit("update");
    };

    const clear = () => {
      // Ensure to clear functions for syncronism
      clearInterval(iterativePrinting.value);
      clearInterval(iterativeTimer.value);
    };

    const xtermSyncFrame = (givenTime: any) => {
      console.log("xtem", xterm.value);
      // xterm.value.write('\u001Bc'); // clean screen
      const frame = searchClosestFrame(givenTime, frames.value);
      clear();
      xterm.value.write(frame.message); // write frame on xterm
      iterativeTimer.value = setTimeout(timer.bind(null), 1);
      iterativePrinting.value = setTimeout(
        print.bind(null, frame.index + 1, logs.value),
        // @ts-ignore
        frame.waitForPrint * (1 / defaultSpeed.value)
      );
    };

    const searchClosestFrame = (givenTime: any, frames: any) => {
      // applies a binary search to find nearest frame

      let between;
      let lowerBound = 0;
      let higherBound = frames.length - 1;
      let nextTimeSetPrint;

      for (; higherBound - lowerBound > 1; ) {
        // progressive increment search
        between = Math.floor((lowerBound + higherBound) / 2);
        if (frames[between].incTime < givenTime) {
          lowerBound = between;
          nextTimeSetPrint = givenTime - frames[between].incTime;
        } else {
          higherBound = between;
          nextTimeSetPrint = frames[between].incTime - givenTime;
        }
      }
      return {
        message: frames[lowerBound].incMessage,
        index: lowerBound,
        waitForPrint: nextTimeSetPrint,
      };
    };

    const print = (i: any, logsArray: any) => {
      // Writes iteratevely on xterm as time progresses
      sliderChange.value = false;
      if (!paused.value) {
        xterm.value.write(`${logsArray[i].message}`);
        if (i === logsArray.length - 1) return;
        const nowTimerDisplay = new Date(logsArray[i].time);
        const future = new Date(logsArray[i + 1].time);
        // @ts-ignore
        const interval = future - nowTimerDisplay;
        // @ts-ignore
        iterativePrinting.value = setTimeout(print.bind(null, i + 1, logsArray),  interval * (1 / defaultSpeed.value));
      }
    };


    return {
      showDialog,
      terminal,
      currentTime,
      totalLength,
      endTimerDisplay,
      getTimerNow,
      paused,
      previousPause,
      sliderChange,
      speedList,
      logs,
      frames,
      defaultSpeed,
      transition,
      pauseHandler,
      nowTimerDisplay,
      changeSliderTime,
      speedChange,
    };
  },
});
</script>
