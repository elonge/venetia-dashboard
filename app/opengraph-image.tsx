import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'The Venetia Project';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FDFBF7', // bg-page-bg
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          border: '20px solid #1A2A40', // border-navy
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#1A2A40', // text-navy
              margin: 0,
              lineHeight: 1,
            }}
          >
            The Venetia Project
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: '#78350F', // text-accent-brown
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            When AI Meets Primary Sources
          </p>
          <div
            style={{
              marginTop: '40px',
              display: 'flex',
              gap: '10px',
              fontSize: '24px',
              color: '#4A7C59', // text-accent-green
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            History · Archive · Intelligence
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
