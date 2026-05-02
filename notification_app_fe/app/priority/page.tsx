'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { fetchNotifications, Notification } from '@/lib/api';
import NotificationCard from '@/components/NotificationCard';
import { comparePriority } from '@/lib/priority';
import { Log } from 'logging_middleware';

export default function PriorityInbox() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [limit, setLimit] = useState(10);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('readNotifications');
    if (saved) {
      setReadIds(new Set(JSON.parse(saved)));
    }
    Log("frontend", "info", "page", "Priority Inbox page mounted");
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchNotifications(); 
        setAllNotifications(data);
      } catch (err: any) {
        setError(err.message);
        Log("frontend", "error", "page", `Load err: ${err.message}`.substring(0, 48));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleMarkRead = (id: string) => {
    const newRead = new Set(readIds);
    newRead.add(id);
    setReadIds(newRead);
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(newRead)));
  };

  const unreadNotifications = allNotifications.filter(n => !readIds.has(n.ID));
  const sortedPriority = [...unreadNotifications].sort(comparePriority);
  const displayNotifications = sortedPriority.slice(0, limit);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Priority Inbox</Typography>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Show Top</InputLabel>
          <Select
            id="limit-select"
            value={limit}
            label="Show Top"
            onChange={(e) => {
              setLimit(Number(e.target.value));
              Log("frontend", "info", "component", `Limit: ${e.target.value}`);
            }}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
      ) : (
        <>
          {displayNotifications.length === 0 ? (
            <Typography variant="body1" color="text.secondary">No unread priority notifications.</Typography>
          ) : (
            displayNotifications.map(notif => (
              <NotificationCard 
                key={notif.ID} 
                notification={notif} 
                isRead={false}
                onMarkRead={handleMarkRead}
              />
            ))
          )}
        </>
      )}
    </Box>
  );
}
