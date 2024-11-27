import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { searchPlugin } from '@react-pdf-viewer/search';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

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
    let url = null;
    if (file instanceof Blob) {
      url = URL.createObjectURL(file);
      setPdfUrl(url);
    }
    
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  React.useEffect(() => {
    if (searchKeyword && searchPluginInstance.search) {
      const timeoutId = setTimeout(() => {
        searchPluginInstance.search(searchKeyword);
      }, 500);
      
      return () => clearTimeout(timeoutId);
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