'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      color: 'text.primary',
      mb: 4
    }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ 
          flexGrow: 1, 
          fontWeight: 800,
          background: 'linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Campus Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            id="nav-all-notifications"
            color="primary" 
            variant={pathname === '/' ? 'contained' : 'text'}
            component={Link} 
            href="/"
            sx={{ fontWeight: 'bold' }}
          >
            All Notifications
          </Button>
          <Button 
            id="nav-priority-inbox"
            color="primary" 
            variant={pathname === '/priority' ? 'contained' : 'text'}
            component={Link} 
            href="/priority"
            sx={{ fontWeight: 'bold' }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
