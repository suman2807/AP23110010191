'use client';
import { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, Pagination } from '@mui/material';
import { fetchNotifications, Notification } from '@/lib/api';
import NotificationCard from '@/components/NotificationCard';
import { Log } from 'logging_middleware';

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('readNotifications');
    if (saved) {
      setReadIds(new Set(JSON.parse(saved)));
    }
    Log("frontend", "info", "page", "All Notifications page mounted");
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchNotifications({
          limit: 10,
          page,
          notification_type: typeFilter || undefined
        });
        setNotifications(data);
      } catch (err: any) {
        setError(err.message);
        Log("frontend", "error", "api", `Load err: ${err.message}`.substring(0, 48));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, typeFilter]);

  const handleMarkRead = (id: string) => {
    const newReadIds = new Set(readIds);
    newReadIds.add(id);
    setReadIds(newReadIds);
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(newReadIds)));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          All Notifications
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Type</InputLabel>
          <Select
            id="type-filter-select"
            value={typeFilter}
            label="Type"
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
              Log("frontend", "info", "component", `Filter: ${e.target.value}`);
            }}
          >
            <MenuItem value=""><em>All Types</em></MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {notifications.map((n) => (
            <NotificationCard 
              key={n.ID} 
              notification={n} 
              isRead={readIds.has(n.ID)}
              onMarkRead={handleMarkRead}
            />
          ))}
          {notifications.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                id="pagination-controls"
                count={10} 
                page={page} 
                onChange={(e, value) => setPage(value)} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
