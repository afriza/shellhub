// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "../styles/_variables.scss";

// Vuetify
import { createVuetify } from "vuetify";

const light = {
  dark: false,
  colors: {
    primary: "#667acc",
    secondary: "#c4c4c4",
    background: "#FFFFFF",
    tabs: "#FFFFFF",
    foreground: "#FFFFFF",
    paymentForm: "#FFFFFF",
  },
};

const dark = {
  dark: true,
  colors: {
    primary: "#667acc",
    secondary: "#1E2127",
    background: "#18191B",
    tabs: "#1E1E1E",
    foreground: "#1E1E1E",
    paymentForm: "#E0E0E0",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      dark,
      light,
    },
  },
});
