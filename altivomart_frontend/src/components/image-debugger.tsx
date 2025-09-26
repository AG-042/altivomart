"use client";

import { useState, useEffect } from 'react';
import { fetchProducts, Product } from '@/lib/api';
import { mediaURL } from '@/lib/utils';

// Temporary debugging component to test image URLs
export function ImageDebugger() {
  const [products, setProducts] = useState<Product[]>([]);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.slice(0, 3)); // Test first 3 products
        
        // Debug environment variables
        const envDebug = {
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
          NEXT_PUBLIC_API_ORIGIN: process.env.NEXT_PUBLIC_API_ORIGIN,
          window_location: typeof window !== 'undefined' ? window.location.href : 'N/A'
        };
        
        setDebugInfo(envDebug);
        console.log('Environment Debug:', envDebug);
        
      } catch (error) {
        console.error('Failed to load products for debugging:', error);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">🔧 Image Debug Information</h3>
      
      <div className="mb-4">
        <h4 className="font-medium">Environment Variables:</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
      
      <div className="space-y-4">
        {products.map((product) => {
          const originalUrl = product.main_image;
          const processedUrl = mediaURL(originalUrl);
          
          return (
            <div key={product.id} className="border rounded p-3 bg-white">
              <h5 className="font-medium">{product.name}</h5>
              <div className="text-sm space-y-1">
                <div><strong>Original URL:</strong> {originalUrl || 'null'}</div>
                <div><strong>Processed URL:</strong> {processedUrl || 'null'}</div>
                <div className="flex items-center gap-2">
                  <strong>Test Image:</strong>
                  {processedUrl ? (
                    <img 
                      src={processedUrl} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      onLoad={() => console.log('✅ Image loaded:', processedUrl)}
                      onError={() => console.log('❌ Image failed:', processedUrl)}
                    />
                  ) : (
                    <span className="text-red-500">No URL</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
