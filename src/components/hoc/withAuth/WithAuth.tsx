import type { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { readCookie } from '@/utils/cookie';
import { StorageKeys } from '@/constants';
import { useGetUserQuery } from '@/store/userApi/userApi';
import { TaLoader } from '@/components/atoms';

export const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return (props: P) => {
    const token = readCookie(StorageKeys.AUTH_TOKEN);
    const {
      data: user,
      isLoading,
      isError,
    } = useGetUserQuery(undefined, {
      skip: !token,
    });

    if (!token) {
      return <Navigate to='/login' replace />;
    }

    if (isLoading) {
      return <TaLoader open={true} />;
    }

    if (isError || !user) {
      return <Navigate to='/login' replace />;
    }

    return <WrappedComponent {...props} />;
  };
};
