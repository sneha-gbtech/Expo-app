import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export const useAuthNavigation = () => {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn) {
            router.replace('/(tabs)');
        } else {
            router.replace('/(auth)/signin');
        }
    }, [isLoaded, isSignedIn]);

    return { isLoaded, isSignedIn };
};

export const useSignOutNavigation = () => {
    const { signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/(auth)/signin');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return { handleSignOut };
};
