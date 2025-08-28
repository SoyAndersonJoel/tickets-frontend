import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return {
        token: await user.getIdToken(),
        user: {
          id: user.uid,
          email: user.email,
          nombre: user.displayName || 'Usuario'
        }
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Credenciales incorrectas');
    }
  },

  // Registro (para crear usuarios de prueba)
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Escuchar cambios de autenticación
  onAuthChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};
