const DB_NAME = 'PdfCache';
const STORE_NAME = 'pdfs';
const DB_VERSION = 1;

class PdfCache {
  constructor() {
    this.db = null;
    this.initDB();
  }

  initDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening PDF cache database:', event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
    };
  }

  async cachePdf(id, pdfBlob, metadata) {
    if (!this.db) {
      console.warn('Database not initialized');
      return false;
    }

    try {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await store.put({
        id,
        pdf: pdfBlob,
        metadata,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error caching PDF:', error);
      return false;
    }
  }

  async getPdf(id) {
    if (!this.db) {
      console.warn('Database not initialized');
      return null;
    }

    try {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const result = await store.get(id);

      return result;
    } catch (error) {
      console.error('Error retrieving PDF from cache:', error);
      return null;
    }
  }

  async deletePdf(id) {
    if (!this.db) {
      console.warn('Database not initialized');
      return false;
    }

    try {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await store.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting PDF from cache:', error);
      return false;
    }
  }

  async clearCache() {
    if (!this.db) {
      console.warn('Database not initialized');
      return false;
    }

    try {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await store.clear();
      return true;
    } catch (error) {
      console.error('Error clearing PDF cache:', error);
      return false;
    }
  }
}

export const pdfCache = new PdfCache(); 