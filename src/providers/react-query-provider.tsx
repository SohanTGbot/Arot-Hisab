"use client";

import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 60 * 24, // 24 hours (data stays fresh for 1 day)
                        gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days (keep in cache/storage)
                        refetchOnWindowFocus: false,
                        refetchOnMount: false,
                    },
                },
            })
    );

    const [persister, setPersister] = useState<any>(null);

    useEffect(() => {
        // Ensure localStorage is available (client-side only)
        if (typeof window !== 'undefined') {
            const localStoragePersister = createSyncStoragePersister({
                storage: window.localStorage,
            });
            setPersister(localStoragePersister);
        }
    }, []);

    if (!persister) {
        // Render nothing or a simple loader until persister is ready to avoid hydration mismatch
        return null;
        // Alternatively, you could return children efficiently if you handle hydration separately, 
        // but waiting for persister ensures we start with cached data.
    }

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
        >
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
    );
}
