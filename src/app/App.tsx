import { AppRouter } from '@/routes/Router';
import { Slide, ToastContainer } from 'react-toastify';
import styles from './App.module.scss';
import { useAppSelector } from '@/hooks/reduxHooks';
import { allApis } from '@/store';
import { TaLoader } from '@/components/atoms';

const App = () => {
  const globalLoading = allApis.reduce((acc, api) => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const apiState = useAppSelector((state) => state[api.reducerPath]);
    return (
      acc ||
      Object.values(apiState.queries).some((q) => q?.status === 'pending') ||
      Object.values(apiState.mutations).some((q) => q?.status === 'pending')
    );
  }, false);

  return (
    <main className={styles['ta-app']}>
      <div className={styles['ta-app__content']}>
        <AppRouter />
      </div>
      <ToastContainer position='bottom-right' autoClose={4000} transition={Slide} theme='light' />
      <TaLoader open={globalLoading} />
    </main>
  );
};

export default App;
