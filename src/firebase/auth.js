import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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

      // Impedir login si el correo no está verificado
      if (!user.emailVerified) {
        // Cerrar sesión inmediata para no mantener sesión de usuario no verificado
        try { await signOut(auth); } catch (e) { /* ignorar */ }
        const err = new Error('Email no verificado. Revisa tu bandeja y confirma tu correo.');
        err.code = 'auth/email-not-verified';
        throw err;
      }

      // Devuelve el objeto User de Firebase
      return user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Credenciales incorrectas');
    }
  },

  // Registro (para crear usuarios de prueba)
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Intentar enviar email de verificación y devolver resultado
      try {
        // Opcional: actionCodeSettings para controlar la URL de retorno
        const actionCodeSettings = {
          url: window.location.origin + '/login',
          handleCodeInApp: false
        };
        await sendEmailVerification(user, actionCodeSettings);
        return { user, emailSent: true };
      } catch (emailErr) {
        console.error('Error sending verification email:', emailErr);
        return { user, emailSent: false, emailError: emailErr.message || String(emailErr) };
      }
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

// Reenviar correo de verificación: inicia sesión temporalmente, envía verificación y cierra sesión
export const resendVerification = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const actionCodeSettings = {
      url: window.location.origin + '/login',
      handleCodeInApp: false
    };
    await sendEmailVerification(user, actionCodeSettings);
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error resending verification:', error);
    return { success: false, error: error.message || String(error) };
  }
};
