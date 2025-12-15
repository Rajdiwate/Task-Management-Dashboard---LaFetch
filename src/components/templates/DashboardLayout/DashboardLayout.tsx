import { useState } from 'react';
import styles from './DashboardLayout.module.scss';
import { TaHeaderWithAuth, TaDashboardSidebarWithAuth } from '@/components/organisms';
import { TaBox } from '@/components/atoms';
import { TaskListPage } from '@/components/pages';

export const DashboardLayout = function () {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <TaBox sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Header spanning full width */}
      <TaHeaderWithAuth onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Main content area */}
      <TaBox sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <section className={styles['dashboard-layout']} style={{ flexGrow: 1 }}>
          <TaskListPage />
        </section>
      </TaBox>

      {/* Mobile Sidebar (Drawer) */}
      <TaDashboardSidebarWithAuth open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </TaBox>
  );
};

export default DashboardLayout;
