import { NextRequest } from 'next/server';

const MIXPANEL_PROXY_TARGET =
  process.env.MIXPANEL_PROXY_TARGET ?? 'https://api-js.mixpanel.com';

const ENDPOINT_MAP = {
  event: 'track',
  profile: 'engage',
  group: 'groups',
} as const;

type EndpointKey = keyof typeof ENDPOINT_MAP;

export const dynamic = 'force-dynamic';

function isEndpointKey(value: string): value is EndpointKey {
  return value in ENDPOINT_MAP;
}

function buildUpstreamUrl(endpoint: EndpointKey, requestUrl: string) {
  const baseUrl = MIXPANEL_PROXY_TARGET.endsWith('/')
    ? MIXPANEL_PROXY_TARGET
    : `${MIXPANEL_PROXY_TARGET}/`;
  const upstreamUrl = new URL(`${ENDPOINT_MAP[endpoint]}/`, baseUrl);
  const inboundUrl = new URL(requestUrl);

  upstreamUrl.search = inboundUrl.search;

  return upstreamUrl;
}

function getForwardHeaders(request: NextRequest) {
  const headers = new Headers();
  const accept = request.headers.get('accept');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const contentType = request.headers.get('content-type');
  const realIp = request.headers.get('x-real-ip');
  const userAgent = request.headers.get('user-agent');
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (accept) {
    headers.set('accept', accept);
  }

  if (cfConnectingIp) {
    headers.set('cf-connecting-ip', cfConnectingIp);
  }

  if (contentType) {
    headers.set('content-type', contentType);
  }

  if (realIp) {
    headers.set('x-real-ip', realIp);
  }

  if (userAgent) {
    headers.set('user-agent', userAgent);
  }

  if (forwardedFor) {
    headers.set('x-forwarded-for', forwardedFor);
  }

  return headers;
}

async function proxyMixpanelRequest(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await params;

  if (!isEndpointKey(endpoint)) {
    return new Response('Not Found', { status: 404 });
  }

  const upstreamUrl = buildUpstreamUrl(endpoint, request.url);
  try {
    const response = await fetch(upstreamUrl, {
      method: request.method,
      headers: getForwardHeaders(request),
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : await request.arrayBuffer(),
      cache: 'no-store',
      redirect: 'follow',
    });

    const responseHeaders = new Headers();
    const contentType = response.headers.get('content-type');
    const cacheControl = response.headers.get('cache-control');

    if (contentType) {
      responseHeaders.set('content-type', contentType);
    }

    responseHeaders.set('cache-control', cacheControl ?? 'no-store');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Mixpanel proxy request failed:', error);
    return new Response('Mixpanel proxy upstream request failed', { status: 502 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ endpoint: string }> }
) {
  return proxyMixpanelRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ endpoint: string }> }
) {
  return proxyMixpanelRequest(request, context);
}
