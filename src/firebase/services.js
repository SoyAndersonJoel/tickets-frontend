import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from './config';

// Servicio genérico para CRUD
const createCRUDService = (collectionName) => {
  return {
    // Listar todos
    list: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        throw error;
      }
    },

    // Crear nuevo
    create: async (data) => {
      try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return {
          id: docRef.id,
          ...data
        };
      } catch (error) {
        console.error(`Error creating ${collectionName}:`, error);
        throw error;
      }
    },

    // Actualizar existente
    update: async (id, data) => {
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
        return {
          id,
          ...data
        };
      } catch (error) {
        console.error(`Error updating ${collectionName}:`, error);
        throw error;
      }
    },

    // Eliminar
    remove: async (id) => {
      try {
        await deleteDoc(doc(db, collectionName, id));
        return { success: true };
      } catch (error) {
        console.error(`Error deleting ${collectionName}:`, error);
        throw error;
      }
    }
  };
};

// Exportar servicios para cada colección
export const tecnicosService = createCRUDService('tecnicos');
export const clientesService = createCRUDService('clientes');
export const ticketsService = createCRUDService('tickets');
