import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile as updateFirebaseProfile,
  updateEmail as updateFirebaseEmail,
  updatePassword as updateFirebasePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  AuthError,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const getFirebaseErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email address is already in use.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

// Password validation function
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number.' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>/?).' };
  }
  return { isValid: true };
};

export const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
  // Validate password before attempting signup
  const validation = validatePassword(password);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid password.');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateFirebaseProfile(userCredential.user, { displayName });
    }
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error as AuthError));
  }
};

export const logIn = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error as AuthError));
  }
};

export const logInWithGoogle = async (): Promise<void> => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Google sign-in error:", error);
    if (error instanceof Error) {
      if (error.message.includes('popup-closed-by-user')) {
        throw new Error('Sign-in cancelled. Please try again.');
      }
      throw new Error('Failed to sign in with Google. Please try again.');
    }
    throw new Error('An unexpected error occurred during Google sign-in.');
  }
};

export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw new Error("Failed to sign out.");
  }
};

export const updateProfile = async (displayName: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    await updateFirebaseProfile(auth.currentUser, { displayName });
  } catch (error) {
    console.error("Error updating profile: ", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update profile.");
  }
};

export const updateEmail = async (newEmail: string, currentPassword: string): Promise<void> => {
  try {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No user is currently signed in.');
    }

    // Re-authenticate user before updating email
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);

    // Update email
    await updateFirebaseEmail(auth.currentUser, newEmail);
  } catch (error) {
    console.error("Error updating email: ", error);
    if (error instanceof Error) {
      if (error.message.includes('wrong-password') || error.message.includes('invalid-credential')) {
        throw new Error('Current password is incorrect.');
      }
      throw error;
    }
    throw new Error("Failed to update email.");
  }
};

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No user is currently signed in.');
    }

    // Validate new password
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid password.');
    }

    // Re-authenticate user before updating password
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);

    // Update password
    await updateFirebasePassword(auth.currentUser, newPassword);
  } catch (error) {
    console.error("Error updating password: ", error);
    if (error instanceof Error) {
      if (error.message.includes('wrong-password') || error.message.includes('invalid-credential')) {
        throw new Error('Current password is incorrect.');
      }
      throw error;
    }
    throw new Error("Failed to update password.");
  }
};
