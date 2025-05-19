import { AppBar, Toolbar, Typography } from '@mui/material';
import { LayoutPanelTop } from 'lucide-react';

const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: '#7b1fa2' }} 
    >
      <Toolbar>
        <LayoutPanelTop style={{ marginRight: 10 }} />
        <Typography variant="h6" component="div">
          Kanban Board
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
