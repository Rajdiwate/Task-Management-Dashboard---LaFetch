import { withAuth } from '@/components/hoc';
import { TaAppBar, TaTypography, TaIconButton, TaStack, TaButton } from '@/components/atoms';
import { Avatar } from '@mui/material';
import { TaIcon } from '@/core/TaIcon';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeCookie } from '@/utils/cookie';
import { StorageKeys } from '@/constants';

import { useGetUserQuery } from '@/store/userApi/userApi';

type TaHeaderProps = {
  onMenuClick?: () => void;
};

const TaHeader = ({ onMenuClick }: TaHeaderProps) => {
  const { data: user } = useGetUserQuery();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    removeCookie(StorageKeys.AUTH_TOKEN);
    navigate('/login');
  };

  return (
    <TaAppBar
      position='sticky'
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <TaStack direction='row' alignItems='center' spacing={2} sx={{ flexGrow: 1 }}>
        <Avatar>{user?.username?.[0]?.toUpperCase()}</Avatar>
        <TaTypography variant='h2' color='textPrimary' fontWeight='bold'>
          {user?.username}
        </TaTypography>
      </TaStack>

      {/* Desktop Navigation */}
      <TaStack direction='row' spacing={2} sx={{ display: { xs: 'none', lg: 'flex' } }}>
        <TaButton
          variant={pathname.includes('tasks') ? 'contained' : 'text'}
          startIcon={<TaIcon.BriefCase />}
          onClick={() => navigate('/tasks')}
        >
          Tasks
        </TaButton>
        <TaButton
          variant={pathname.includes('profile') ? 'contained' : 'text'}
          startIcon={<TaIcon.Person />}
          onClick={() => navigate('/profile')}
        >
          Profile
        </TaButton>
        <TaButton color='error' variant='text' startIcon={<TaIcon.Logout />} onClick={handleLogout}>
          Logout
        </TaButton>
      </TaStack>

      <TaIconButton
        edge='end'
        aria-label='menu'
        onClick={onMenuClick}
        sx={{ display: { lg: 'none' } }}
      >
        <TaIcon.HamburgerMenu />
      </TaIconButton>
    </TaAppBar>
  );
};

export const TaHeaderWithAuth = withAuth(TaHeader);
