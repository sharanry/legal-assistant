import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { searchPlugin } from '@react-pdf-viewer/search';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { pdfCache } from '../utils/pdfCache';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';

const PdfViewer = ({ file, searchKeyword }) => {
  const searchPluginInstance = searchPlugin({
    keyword: searchKeyword,
    highlightAll: true,
    matchCase: false,
    wholeWords: true,
    onSearchFinished: (matches) => {
      if (matches.length > 0) {
        matches[0].jumpToMatch();
      }
    },
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    searchPlugin: searchPluginInstance,
  });
  
  const [pdfUrl, setPdfUrl] = React.useState(null);

  React.useEffect(() => {
    const loadPdf = async () => {
      if (file instanceof Blob) {
        try {
          // Try to get from cache first
          const cachedPdf = await pdfCache.getPdf(file.name);
          
          if (cachedPdf) {
            // If found in cache, use it
            const url = URL.createObjectURL(cachedPdf.pdf);
            setPdfUrl(url);
          } else {
            // If not in cache, create new URL and cache it
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
            
            // Cache the PDF for future use
            await pdfCache.cachePdf(file.name, file, {
              name: file.name,
              size: file.size,
              type: file.type
            });
          }
        } catch (error) {
          console.error('Error loading PDF:', error);
          // Fallback to direct URL creation if caching fails
          const url = URL.createObjectURL(file);
          setPdfUrl(url);
        }
      } else {
        setPdfUrl(null);
      }
    };

    loadPdf();

    // Cleanup function
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [file]);

  React.useEffect(() => {
    if (searchKeyword && searchPluginInstance.search) {
      setTimeout(() => {
        searchPluginInstance.search(searchKeyword);
      }, 500);
    }
  }, [searchKeyword, searchPluginInstance]);

  if (!pdfUrl) {
    return null;
  }

  return (
    <Worker workerUrl={pdfjsWorker}>
      <div style={{ height: '750px', width: '100%' }}>
        <Viewer
          fileUrl={pdfUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={1}
        />
      </div>
    </Worker>
  );
};

export default PdfViewer; 