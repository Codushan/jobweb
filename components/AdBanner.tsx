'use client';

import { useEffect, useState } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
}

export function AdBanner({ adSlot, adFormat = 'auto', style }: AdBannerProps) {
  const [adStatus, setAdStatus] = useState<'loading' | 'filled' | 'unfilled'>('loading');

  useEffect(() => {
    // 1. Trigger the standard push to AdSense queue
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.warn('AdSense script blocked or not loaded:', err);
      setAdStatus('unfilled');
      return;
    }

    // 2. Set up observer to track the data-ad-status attribute changes from AdSense script
    const insElement = document.getElementById(`adsense-${adSlot}`);
    if (!insElement) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const status = insElement.getAttribute('data-ad-status');
          if (status === 'filled') {
            setAdStatus('filled');
          } else if (status === 'unfilled') {
            setAdStatus('unfilled');
          }
        }
      });
    });

    observer.observe(insElement, {
      attributes: true,
      attributeFilter: ['data-ad-status', 'style']
    });

    // 3. Fallback timer: If after 4 seconds the ad is still unfilled or height is 0, collapse it.
    const timer = setTimeout(() => {
      const status = insElement.getAttribute('data-ad-status');
      const height = insElement.offsetHeight;
      if (status === 'unfilled' || height === 0) {
        setAdStatus('unfilled');
      } else if (status === 'filled' || height > 0) {
        setAdStatus('filled');
      }
    }, 4000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [adSlot]);

  // If the ad is unfilled, display absolutely nothing (collapses container completely)
  if (adStatus === 'unfilled') {
    return null;
  }

  return (
    <div 
      className="adsense-container" 
      style={{ 
        margin: adStatus === 'filled' ? '24px auto' : '0 auto', 
        textAlign: 'center', 
        overflow: 'hidden',
        width: '100%',
        maxWidth: '1280px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // Keep a 1px height layout initially so that AdSense can compute parent container width on render
        height: adStatus === 'filled' ? 'auto' : '1px',
        opacity: adStatus === 'filled' ? 1 : 0.01,
        transition: 'opacity 0.3s ease, margin 0.3s ease'
      }}
    >
      <ins
        id={`adsense-${adSlot}`}
        className="adsbygoogle"
        style={style || { display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Place your Publisher ID here
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
