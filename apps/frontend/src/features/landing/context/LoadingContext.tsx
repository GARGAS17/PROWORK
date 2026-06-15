import { createContext, useContext, useState, ReactNode } from 'react';

type AppStatus = 'loading_3d' | 'ready';

interface LoadingContextProps {
  status: AppStatus;
  setReady: () => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AppStatus>('loading_3d');

  const setReady = () => setStatus('ready');

  return (
    <LoadingContext.Provider value={{ status, setReady }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
