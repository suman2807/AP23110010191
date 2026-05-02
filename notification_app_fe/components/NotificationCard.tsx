'use client';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Notification } from '@/lib/api';
import { Log } from 'logging_middleware';

interface Props {
  notification: Notification;
  isRead: boolean;
  onMarkRead: (id: string) => void;
}

export default function NotificationCard({ notification, isRead, onMarkRead }: Props) {
  const handleClick = () => {
    if (!isRead) {
      onMarkRead(notification.ID);
      Log("frontend", "info", "component", `Viewed: ${notification.ID}`);
    }
  };

  const getChipColor = (type: string) => {
    switch(type) {
      case 'Placement': return 'success';
      case 'Result': return 'primary';
      case 'Event': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card 
      id={`notification-card-${notification.ID}`}
      onClick={handleClick}
      elevation={isRead ? 0 : 2}
      sx={{ 
        mb: 2, 
        cursor: isRead ? 'default' : 'pointer',
        bgcolor: isRead ? 'background.paper' : '#eef2ff',
        borderLeft: isRead ? '4px solid #e2e8f0' : '4px solid #4f46e5',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateY(0)',
        border: isRead ? '1px solid #e2e8f0' : 'none',
        '&:hover': {
          transform: isRead ? 'none' : 'translateY(-4px)',
          boxShadow: isRead ? 'none' : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
        }
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Chip 
            label={notification.Type} 
            color={getChipColor(notification.Type) as any} 
            size="small" 
            sx={{ fontWeight: 600, letterSpacing: '0.02em' }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {new Date(notification.Timestamp).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ 
          fontWeight: isRead ? 400 : 600,
          color: isRead ? 'text.secondary' : 'text.primary',
          lineHeight: 1.6
        }}>
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}
