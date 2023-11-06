// firebaseUtils.js
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase-config'; // Your Firebase configuration file

export const updateDataModelIfNeeded = async (documentId, newValues) => {
  const documentRef = doc(db, 'games', documentId);

  try {
    // Check if the document exists and has the required fields
    const docSnap = await getDoc(documentRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      let updateRequired = false;
      let fieldsToUpdate = {};

      // Check each field if it needs to be updated
      for (const [key, value] of Object.entries(newValues)) {
        if (!data.hasOwnProperty(key)) {
          updateRequired = true;
          fieldsToUpdate[key] = value;
        }
      }

      // Update the document with the new fields if required
      if (updateRequired) {
        await updateDoc(documentRef, fieldsToUpdate);
        console.log('Document updated with new fields:', fieldsToUpdate);
      } else {
        console.log('No update required, all fields are present');
      }
    } else {
      console.log('Document does not exist');
    }
  } catch (error) {
    console.error('Error updating document:', error);
  }
};
