"use client";

import { Toaster, toast } from "sonner";

// Toast configuration
export const toastConfig = {
  duration: 4000,
  position: "top-right" as const,
};

// Success toast
export function showSuccess(message: string, options?: any) {
  return toast.success(message, {
    ...toastConfig,
    ...options,
  });
}

// Error toast
export function showError(message: string, options?: any) {
  return toast.error(message, {
    ...toastConfig,
    ...options,
  });
}

// Info toast
export function showInfo(message: string, options?: any) {
  return toast.info(message, {
    ...toastConfig,
    ...options,
  });
}

// Warning toast
export function showWarning(message: string, options?: any) {
  return toast.warning(message, {
    ...toastConfig,
    ...options,
  });
}

// Loading toast
export function showLoading(message: string, options?: any) {
  return toast.loading(message, {
    ...toastConfig,
    ...options,
  });
}

// Promise-based toast for async operations
export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options?: any
) {
  return toast.promise(promise, {
    ...toastConfig,
    loading: messages.loading,
    success: (data: T) => messages.success,
    error: (error: any) => `${messages.error}: ${error.message || 'Unknown error'}`,
    ...options,
  });
}

// Custom toast component wrapper
export { Toaster };