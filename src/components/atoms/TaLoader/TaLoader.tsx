import { Backdrop, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

interface TaLoaderProps {
  open: boolean;
}

export const TaLoader = ({ open }: TaLoaderProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;

    if (open) {
      // Show loader after 150ms (prevents flicker)
      timer = setTimeout(() => {
        setVisible(true);
      }, 0);
    } else {
      // Wait before hiding (prevents flicker during rapid calls)
      timer = setTimeout(() => {
        setVisible(false);
      }, 150);
    }

    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Backdrop sx={(theme) => ({ zIndex: theme.zIndex.drawer + 10000 })} open={visible && open}>
      <CircularProgress />
    </Backdrop>
  );
};
