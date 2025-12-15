import { TaButton, TaStack, TaTypography } from '@/components/atoms';
import { useForm } from 'react-hook-form';
import type { loginPageSchemaType } from './LoginPage.schema';
import { TaFormTextField } from '@/components/molecules';
import styles from './LoginPage.module.scss';
import { logger } from '@/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginPageSchema } from './LoginPage.schema';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/store/userApi/userApi';
import { toast } from 'react-toastify';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<loginPageSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(loginPageSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin = async (data: loginPageSchemaType) => {
    logger.info(data);
    try {
      await login(data).unwrap();
      toast.success('Login successful');
      navigate('/tasks');
    } catch (error) {
      logger.error(error);
      toast.error('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className={styles['login-page']}>
      <TaStack
        spacing={5}
        justifyContent='center'
        alignItems='center'
        className={styles['login-page__stack']}

      >
        <TaTypography variant='h3' component='h1'>
          Welcome Back
        </TaTypography>

        <TaFormTextField
          control={control}
          name='username'
          label='Username'
          errors={errors}
          id='username'
          dataTestId='username'
          textFieldProps={{
            fullWidth: true,
          }}
        />

        <TaFormTextField
          control={control}
          name='password'
          label='Password'
          errors={errors}
          id='password'
          dataTestId='password'
          type='password'
          textFieldProps={{
            fullWidth: true,
          }}
        />

        <TaButton
          type='submit'
          variant='contained'
          color='primary'
          size='large'
          fullWidth
          loading={isLoading}
        >
          Login
        </TaButton>
      </TaStack>
    </form>
  );
};
