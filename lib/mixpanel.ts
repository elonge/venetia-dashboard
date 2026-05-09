import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const MIXPANEL_PROXY_HOST = '/ingest';
const MIXPANEL_PROXY_ROUTES = {
  track: 'event',
  engage: 'profile',
  groups: 'group',
} as const;

let hasInitialized = false;

function warnMixpanelDisabled(message: string, ...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(message, ...args);
  }
}

export const initMixpanel = () => {
  if (!MIXPANEL_TOKEN) {
    warnMixpanelDisabled('Mixpanel token is not set. Mixpanel is not initialized.');
    return;
  }

  if (hasInitialized) {
    return;
  }

  mixpanel.init(MIXPANEL_TOKEN, {
    api_host: MIXPANEL_PROXY_HOST,
    api_payload_format: 'json',
    api_routes: MIXPANEL_PROXY_ROUTES,
    debug: process.env.NODE_ENV === 'development',
    persistence: 'localStorage',
  });

  hasInitialized = true;
};

export const trackEvent = (name: string, props: Record<string, unknown> = {}) => {
  if (!MIXPANEL_TOKEN) {
    warnMixpanelDisabled('Mixpanel token is not set. Event not tracked:', name, props);
    return;
  }

  initMixpanel();
  mixpanel.track(name, props);
};
