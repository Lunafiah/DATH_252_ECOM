import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';

const Product3DViewer = ({ modelUrl, iosModelUrl, productName, poster }) => {
  const modelViewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    
    if (modelViewer) {
      const handleLoad = () => setIsLoading(false);
      const handleError = () => {
        setIsLoading(false);
        setHasError(true);
      };

      modelViewer.addEventListener('load', handleLoad);
      modelViewer.addEventListener('error', handleError);

      return () => {
        modelViewer.removeEventListener('load', handleLoad);
        modelViewer.removeEventListener('error', handleError);
      };
    }
  }, []);

  if (!modelUrl) {
    return null;
  }

  return (
    <div className="product-3d-viewer-container position-relative" style={{ height: '500px', backgroundColor: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        ios-src={iosModelUrl || modelUrl}
        alt={productName || '3D Product Model'}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        auto-rotate-delay="1000"
        rotation-per-second="30deg"
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        poster={poster}
        style={{ width: '100%', height: '100%' }}
      >
        {/* AR Button */}
        <button 
          slot="ar-button"
          className="btn btn-dark position-absolute bottom-0 start-50 translate-middle-x mb-4 px-4 py-2 shadow-lg"
          style={{ 
            zIndex: 10,
            borderRadius: '50px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            fontSize: '0.9rem'
          }}
        >
          <i className="fa fa-cube me-2"></i>
          View in Your Room
        </button>

        {/* Loading Spinner */}
        {isLoading && (
          <div 
            className="d-flex flex-column align-items-center justify-content-center h-100 position-absolute top-0 start-0 w-100"
            style={{ backgroundColor: 'rgba(248, 249, 250, 0.9)', zIndex: 5 }}
          >
            <div className="spinner-border text-dark mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading 3D model...</span>
            </div>
            <p className="text-muted fw-bold">Loading 3D Model...</p>
          </div>
        )}

        {/* Error Message */}
        {hasError && (
          <div 
            className="alert alert-warning m-4 position-absolute top-50 start-50 translate-middle"
            style={{ zIndex: 5, maxWidth: '400px' }}
          >
            <i className="fa fa-exclamation-triangle me-2"></i>
            <strong>Unable to load 3D model.</strong>
            <p className="mb-0 small mt-2">Please try refreshing the page or view product images instead.</p>
          </div>
        )}
      </model-viewer>

      {/* Instructions */}
      <div 
        className="position-absolute bottom-0 start-0 w-100 text-center pb-2"
        style={{ 
          background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
          pointerEvents: 'none',
          paddingTop: '60px'
        }}
      >
        <small className="text-white fw-bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          <i className="fa fa-hand-pointer-o me-1"></i>
          Drag to rotate • Scroll to zoom
          <span className="d-none d-md-inline"> • Tap AR button on mobile</span>
        </small>
      </div>

      {/* 3D Badge */}
      <div className="position-absolute top-0 end-0 m-3">
        <span className="badge bg-dark px-3 py-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
          <i className="fa fa-cube me-1"></i>
          3D & AR
        </span>
      </div>
    </div>
  );
};

export default Product3DViewer;
