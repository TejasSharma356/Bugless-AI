import { db } from '../firebase';
import { ref, set, get, query as dbQuery, orderByChild, limitToLast } from 'firebase/database';
import type { ReviewHistoryItem } from '../types';

/**
 * Retrieves the analysis history for a specific user from Realtime Database.
 * @param userId The UID of the user whose history to fetch.
 * @returns A promise that resolves to an array of past review items.
 */
export const getHistory = async (userId: string): Promise<ReviewHistoryItem[]> => {
  try {
    const historyRef = ref(db, `users/${userId}/reviews`);
    
    // First try with orderByChild query
    let snapshot;
    try {
      const historyQuery = dbQuery(historyRef, orderByChild('date'), limitToLast(20));
      snapshot = await get(historyQuery);
    } catch (queryError) {
      // If orderByChild fails (e.g., no index), fall back to simple query
      console.warn('orderByChild query failed, using simple query:', queryError);
      snapshot = await get(historyRef);
    }
    
    const history: ReviewHistoryItem[] = [];
    if (snapshot.exists()) {
      const data = snapshot.val();
      
      // Convert the data object to an array
      if (data && typeof data === 'object') {
        // Iterate through all keys in the data object
        Object.keys(data).forEach(key => {
          const item = data[key] as ReviewHistoryItem;
          // Validate that the item has all required fields
          if (item && item.date && item.code && item.result) {
            history.push(item);
          }
        });
      }
      
      // Sort by date descending (newest first)
      history.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
      
      // Limit to last 20 items
      return history.slice(0, 20);
    }
    
    return history;
  } catch (error) {
    console.error('Failed to fetch history from Realtime Database', error);
    // Try a simple fetch without query as fallback
    try {
      const historyRef = ref(db, `users/${userId}/reviews`);
      const snapshot = await get(historyRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const history: ReviewHistoryItem[] = [];
        
        if (data && typeof data === 'object') {
          const historyArray = Object.keys(data).map(key => data[key] as ReviewHistoryItem)
            .filter(item => item && item.date && item.code && item.result);
          
          historyArray.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          });
          
          return historyArray.slice(0, 20);
        }
      }
    } catch (fallbackError) {
      console.error('Fallback fetch also failed:', fallbackError);
    }
    
    return [];
  }
};

/**
 * Sanitizes a string to be used as a Firebase Realtime Database path key.
 * Firebase paths cannot contain '.', '#', '$', '[', or ']'
 */
const sanitizePathKey = (key: string): string => {
  return key.replace(/[.#$\[\]]/g, '_');
};

/**
 * Saves a new review item to a user's history in Realtime Database.
 * @param userId The UID of the user.
 * @param item The review item to save.
 */
export const saveToHistory = async (userId: string, item: ReviewHistoryItem): Promise<void> => {
  try {
    // Sanitize the ID to remove invalid characters for Firebase paths
    const sanitizedId = sanitizePathKey(item.id);
    const historyRef = ref(db, `users/${userId}/reviews/${sanitizedId}`);
    await set(historyRef, item);
  } catch (error) {
    console.error('Failed to save history to Realtime Database', error);
    throw error;
  }
};
