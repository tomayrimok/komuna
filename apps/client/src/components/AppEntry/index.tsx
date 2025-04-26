import React from 'react';
import { LoadingApp } from '../LoadingApp';

interface AppEntryProps {
  children: React.ReactNode;
}
export const AppEntry = ({ children }: AppEntryProps) => {
  const isLoading = false;
  if (isLoading) return <LoadingApp />;
  return children;
};
