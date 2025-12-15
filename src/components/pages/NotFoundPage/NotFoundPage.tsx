import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  return (
    <section className={styles['not-found']}>
      <h1 data-testid='not-found-code'>404</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
    </section>
  );
};
