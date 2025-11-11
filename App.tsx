import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignUpScreen } from './components/auth/SignUpScreen';
import { HomeScreen } from './components/HomeScreen';
import { CodeReviewApp } from './components/CodeReviewApp';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import type { ReviewHistoryItem } from './types';

type UnauthenticatedPage = 'landing' | 'login' | 'signup';
type AuthenticatedView = 'home' | 'editor' | 'profile' | 'settings';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [page, setPage] = useState<UnauthenticatedPage>('landing');
  const [authedView, setAuthedView] = useState<AuthenticatedView>('home');
  const [selectedReview, setSelectedReview] = useState<ReviewHistoryItem | null>(null);
  const previousUserRef = useRef<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const previousUser = previousUserRef.current;
      
      // If user just logged in (transition from null to user), reset to home screen
      if (!previousUser && currentUser) {
        setAuthedView('home');
        setSelectedReview(null);
      }
      
      // If user logged out, reset page state
      if (previousUser && !currentUser) {
        setPage('landing');
      }
      
      // Update the ref to track current user for next change
      previousUserRef.current = currentUser;
      setUser(currentUser);
      setIsLoadingAuth(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Log out user when the tab/window is closed or page is unloaded
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (auth.currentUser) {
        // Use sendBeacon or navigator.sendBeacon for reliable logout on page close
        signOut(auth).catch((error) => {
          console.error('Error signing out on page close:', error);
        });
      }
    };

    // Handle page visibility change (tab switch, minimize, etc.)
    const handleVisibilityChange = () => {
      if (document.hidden && auth.currentUser) {
        // Optional: log out when tab becomes hidden (more aggressive)
        // Uncomment the line below if you want to log out even when tab is just hidden
        // signOut(auth).catch(console.error);
      }
    };

    // Listen for beforeunload event (tab/window closing)
    window.addEventListener('beforeunload', handleBeforeUnload);
    // Listen for pagehide event (more reliable on mobile)
    window.addEventListener('pagehide', handleBeforeUnload);
    // Listen for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (user) {
    switch(authedView) {
      case 'editor':
        return <CodeReviewApp 
          user={user}
          onNavigateHome={() => setAuthedView('home')} 
          initialState={selectedReview}
          onNavigateToProfile={() => setAuthedView('profile')}
          onNavigateToSettings={() => setAuthedView('settings')}
        />;
      case 'profile':
        return <ProfilePage 
          user={user}
          onNavigateHome={() => setAuthedView('home')} 
        />;
      case 'settings':
        return <SettingsPage 
          user={user}
          onNavigateHome={() => setAuthedView('home')} 
        />;
      case 'home':
      default:
        return <HomeScreen 
          user={user}
          onStartReview={() => {
            setSelectedReview(null);
            setAuthedView('editor');
          }}
          onSelectHistoryItem={(item) => {
            setSelectedReview(item);
            setAuthedView('editor');
          }}
          onNavigateToProfile={() => setAuthedView('profile')}
          onNavigateToSettings={() => setAuthedView('settings')}
        />
    }
  }
  
  switch (page) {
    case 'login':
      return <LoginScreen onNavigateToSignUp={() => setPage('signup')} onNavigateToLanding={() => setPage('landing')} />;
    case 'signup':
      return <SignUpScreen onNavigateToLogin={() => setPage('login')} onNavigateToLanding={() => setPage('landing')} />;
    case 'landing':
    default:
      return <LandingPage onNavigateToLogin={() => setPage('login')} onNavigateToSignUp={() => setPage('signup')} />;
  }
}

export default App;
