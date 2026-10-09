import { useTheme, useMediaQuery } from '@mui/material';

export const useScreenSize = () => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  return { isXsScreen, isSmScreen };
};
