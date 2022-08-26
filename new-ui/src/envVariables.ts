export const envVariables = {
    isEnterprise: true,// process.env.VUE_APP_SHELLHUB_ENTERPRISE === 'true',
    isCloud: process.env.VUE_APP_SHELLHUB_CLOUD === 'true',
    stripePublishableKey: process.env.VUE_APP_SHELLHUB_STRIPE_PUBLISHABLE_KEY,
    billingEnable: true,// process.env.VUE_APP_SHELLHUB_BILLING === 'true',
    version: process.env.SHELLHUB_VERSION,
  };