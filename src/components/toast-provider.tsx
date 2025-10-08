'use client'
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export function ToastProvider() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const currentTheme = theme === 'system' ? systemTheme : theme;


  return (
    <Toaster
      position="top-right"
      theme={currentTheme === 'dark' ? 'dark' : 'light'}
    />
  );
}