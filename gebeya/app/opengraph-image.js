import { ImageResponse } from 'next/og';
export const alt = 'Gebeya Watch';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    (<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#1d4ed8,#0b2a6f)', color: '#fff', fontSize: 100, fontWeight: 800 }}>
      <div>Gebeya Watch</div><div style={{ fontSize: 40, color: '#7dd3fc' }}>Know the real price before you spend</div></div>),
    size
  );
}
