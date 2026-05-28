import { User } from '../types/index';

/**
 * Storage Service - Handles IndexedDB and localStorage operations
 */
class StorageService {
  private dbName = 'LendsqrDB';
  private storeName = 'users';
  private db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB
   */
  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Save user to storage (both localStorage and IndexedDB)
   */
  async saveUser(user: User): Promise<void> {
    // Save to localStorage as backup
    const stored = this.getStoredUsers();
    const index = stored.findIndex(u => u.id === user.id);
    if (index >= 0) {
      stored[index] = user;
    } else {
      stored.push(user);
    }
    localStorage.setItem('lendsqr_user_details', JSON.stringify(stored));

    // Save to IndexedDB if available
    if (this.db) {
      await this.saveToIndexedDB(user);
    }
  }

  /**
   * Get user from storage (prioritize IndexedDB, fallback to localStorage)
   */
  async getUser(userId: string): Promise<User | null> {
    if (this.db) {
      const user = await this.getFromIndexedDB(userId);
      if (user) return user;
    }

    const stored = this.getStoredUsers();
    return stored.find(u => u.id === userId) || null;
  }

  /**
   * Get all stored users
   */
  getStoredUsers(): User[] {
    const stored = localStorage.getItem('lendsqr_user_details');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save to IndexedDB
   */
  private saveToIndexedDB(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(user);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get from IndexedDB
   */
  private getFromIndexedDB(userId: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(userId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  /**
   * Save auth state
   */
  saveAuthState(email: string): void {
    localStorage.setItem('lendsqr_auth_user', JSON.stringify({ email, isAuthenticated: true }));
  }

  /**
   * Get auth state
   */
  getAuthState(): { email: string; isAuthenticated: boolean } | null {
    const auth = localStorage.getItem('lendsqr_auth_user');
    return auth ? JSON.parse(auth) : null;
  }

  /**
   * Clear auth state
   */
  clearAuthState(): void {
    localStorage.removeItem('lendsqr_auth_user');
  }
}

export default new StorageService();
