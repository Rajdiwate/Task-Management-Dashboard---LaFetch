import { withAuth } from '@/components/hoc';
import { TaDrawer, TaStack, TaButton } from '@/components/atoms';
import { TaIcon } from '@/core/TaIcon';
import styles from './TaDashboardSidebar.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeCookie } from '@/utils/cookie';
import { StorageKeys } from '@/constants';

type TaDashboardSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export const TaDashboardSidebar = ({ open = false, onClose }: TaDashboardSidebarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    removeCookie(StorageKeys.AUTH_TOKEN);
    navigate('/login');
  };

  const SidebarContent = (
    <TaStack spacing={2} alignItems='start' sx={{ width: 250, paddingTop: 8, paddingLeft: 2 }}>
      <TaButton
        fullWidth
        variant='text'
        color={pathname.includes('tasks') ? 'primary' : 'inherit'}
        startIcon={<TaIcon.BriefCase />}
        onClick={() => navigate('/tasks')}
        sx={{ justifyContent: 'flex-start' }}
      >
        Tasks
      </TaButton>
      <TaButton
        fullWidth
        variant='text'
        color={pathname.includes('profile') ? 'primary' : 'inherit'}
        startIcon={<TaIcon.Person />}
        onClick={() => navigate('/profile')}
        sx={{ justifyContent: 'flex-start' }}
      >
        Profile
      </TaButton>
      <TaButton
        fullWidth
        color='error'
        variant='text'
        startIcon={<TaIcon.Logout />}
        onClick={handleLogout}
        sx={{ justifyContent: 'flex-start' }}
      >
        Logout
      </TaButton>
    </TaStack>
  );

  return (
    <TaDrawer
      open={open}
      onClose={onClose || (() => {})}
      anchor='right'
      className={styles['dashboard-sidebar']}
    >
      {SidebarContent}
    </TaDrawer>
  );
};

export const TaDashboardSidebarWithAuth = withAuth(TaDashboardSidebar);
