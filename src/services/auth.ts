// import {create} from 'zustand';
//
// interface AuthState {
//     token: string | null;
//     user: any | null;
//     website: any | null;
//     clients: any | null;
//     isAuthenticated: boolean;
//     initializationStarted: any | null;
//     isLoading: boolean;
//     error: string | null;
//     login: (email: string, password: string) => Promise<void>;
//     logout: () => void;
//     fetchWebsite: () => Promise<void>;
//     initialize: () => Promise<void>;
// }
//
// const API_URL = 'https://portalfin.in';
//
// export const useAuth = create<AuthState>((set, get) => ({
//     isInitialized: false,
//     initializationStarted: false,
//     token: localStorage.getItem('token'),
//     user: null,
//     website: null,
//     clients: null,
//     isAuthenticated: !!localStorage.getItem('token'),
//     isLoading: false,
//     error: null,
//
//     login: async (email: string, password: string) => {
//         set({isLoading: true, error: null});
//         try {
//             const response = await fetch(`${API_URL}/api-login.php`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({email, password}),
//             });
//
//             const data = await response.json();
//             console.log(data)
//             if (!response.ok) {
//                 throw new Error(data.error || 'Login failed');
//             }
//             if (data.success == 'false') {
//                 throw new Error('Wrong email or password.');
//             } else {
//                 localStorage.setItem('token', data.token);
//
//                 set({
//                     token: data.token,
//                     isAuthenticated: true,
//                     isLoading: false,
//                 });
//
//                 // Fetch additional user data after login if needed
//                 await get().fetchWebsite();
//             }
//         } catch (error) {
//             set({
//                 error: error instanceof Error ? error.message : 'Login failed',
//                 isLoading: false,
//             });
//             throw error;
//         }
//     },
//
//     logout: () => {
//         localStorage.removeItem('token');
//         set({
//             token: null,
//             user: null,
//             isAuthenticated: false,
//         });
//     },
//
//     initialize: async () => {
//         console.log('initialize called');
//         const token = localStorage.getItem('token');
//         const currentState = get();
//
//         console.log('current state', {
//             tokenExists: !!token,
//             isInitialized: currentState.isInitialized,
//             isLoading: currentState.isLoading,
//             initializationStarted: currentState.initializationStarted
//         });
//
//         // Only proceed if we have a token and initialization hasn't started/completed
//         if (token && !currentState.isInitialized && !currentState.initializationStarted) {
//             console.log('proceeding with initialization');
//             set({
//                 isLoading: true,
//                 initializationStarted: true // Mark initialization as started
//             });
//             try {
//                 console.log('calling fetchWebsite');
//                 const data = await get().fetchWebsite();
//                 console.log('fetch completed successfully');
//
//                 set({
//                     token,
//                     user: true,
//                     website: data.name,
//                     clients: data.clients,
//                     isAuthenticated: true,
//                     isInitialized: true,
//                     isLoading: false,
//                     initializationStarted: false
//                 });
//             } catch (error) {
//                 console.error('Initialization error:', error);
//                 set({
//                     isLoading: false,
//                     isInitialized: false,
//                     initializationStarted: false
//                 });
//                 get().logout();
//             }
//         } else {
//             console.log('skipping initialization - condition not met');
//         }
//     },
//
//     fetchWebsite: async () => {
//         console.log('fetchWebsite called');
//         const token = get().token;
//         if (!token) {
//             console.log('aborting fetch - no token');
//             throw new Error('No token available');
//         }
//
//         console.log('starting fetch');
//         set({ isLoading: true });
//         try {
//             const response = await fetch(`${API_URL}/api-test.php`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({getWebsite: true})
//             });
//             console.log('received response', response.status);
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//
//             const data = await response.json();
//             console.log('fetch successful', data);
//             return data;
//         } catch (error) {
//             console.error('fetch error', error);
//             throw error;
//         } finally {
//             set({ isLoading: false });
//         }
//     },
// }));
import { create } from 'zustand';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const API_URL = 'https://portalfin.in';

export const useAuth = create<AuthState>((set) => ({
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/api-login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok || data.success === 'false' || data.success === 'false ') {
                throw new Error(data.error || 'Wrong email or password.');
            }

            localStorage.setItem('token', data.token);
            set({
                token: data.token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Login failed',
                isLoading: false,
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({
            token: null,
            isAuthenticated: false,
        });
    },
}));