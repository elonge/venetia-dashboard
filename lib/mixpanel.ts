import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initMixpanel = () => {
  if (MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    });
  } else {
    console.warn('Mixpanel token is not set. Mixpanel is not initialized.');
  }
};

export const trackEvent = (name: string, props: Record<string, unknown> = {}) => {
  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token is not set. Event not tracked:', name, props);
    return;
  }
  if (MIXPANEL_TOKEN) {
    mixpanel.track(name, props);
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`[Mixpanel] Track: ${name}`, props);
  }
};
