import React, { useState, useEffect } from 'react';
import {
  Card,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  Avatar,
  Link,
  CircularProgress
} from '@mui/material';
import type { EventSummary } from '../../api/events'; // Adjust path if needed

// --- Types ---

export type SourceItem = {
  itemId: string;
  platform: string;
  url: string;
  title: string;
  contentText: string;
  authorName: string;
  sourceId: string;
  publishedAt: string;
};

export type SourcesResponse = {
  items: SourceItem[];
  total: number;
  page: number;
  pageSize: number;
};

type EventSourcesMonitorProps = {
  event: EventSummary;
  useRealApi?: boolean;
};

// --- Mock Data (10 Items) ---
const MOCK_SOURCES_RESPONSE: SourcesResponse = {
  items: [
    {
      itemId: 'item-1',
      platform: 'מקור (טוויטר)',
      url: 'https://twitter.com',
      title: 'דיווח ראשוני מהשטח',
      contentText: 'תוכן הדיווח מהשטח למעקב ופתרון מהיר',
      authorName: 'מערכת חדשות',
      sourceId: 'src-1',
      publishedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      itemId: 'item-2',
      platform: 'מקור (טלגרם)',
      url: 'https://telegram.org',
      title: 'עדכון מערכתי',
      contentText: 'פרטי עדכון שהתקבלו מערוץ הדיווחים',
      authorName: 'ערוץ חירום',
      sourceId: 'src-2',
      publishedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      itemId: 'item-3',
      platform: 'מקור (חדשות 12)',
      url: 'https://n12.co.il',
      title: 'מבזק מיוחד',
      contentText: 'ידיעה חדשותית ראשונית בנוגע לאירוע המתפתח',
      authorName: 'כתב שטח',
      sourceId: 'src-3',
      publishedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      itemId: 'item-4',
      platform: 'מקור (פייסבוק)',
      url: 'https://facebook.com',
      title: 'הודעת רשות מקומית',
      contentText: 'הודעה רשמית שפורסמה בעמוד הפייסבוק',
      authorName: 'דוברות',
      sourceId: 'src-4',
      publishedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    },
    {
      itemId: 'item-5',
      platform: 'מקור (אינסטגרם)',
      url: 'https://instagram.com',
      title: 'תיעוד מצולם',
      contentText: 'תמונה ודיווח ישיר מזירת האירוע',
      authorName: 'צלם עיתונות',
      sourceId: 'src-5',
      publishedAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    },
    {
      itemId: 'item-6',
      platform: 'מקור (ynet)',
      url: 'https://ynet.co.il',
      title: 'עדכון כתבים',
      contentText: 'סיכום ביניים של הנתונים שהתקבלו עד כה',
      authorName: 'דסק חדשות',
      sourceId: 'src-6',
      publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      itemId: 'item-7',
      platform: 'מקור (יוטיוב)',
      url: 'https://youtube.com',
      title: 'שידור חי',
      contentText: 'קטע וידאו מתועד מתוך האירוע',
      authorName: 'ערוץ דיווחים',
      sourceId: 'src-7',
      publishedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    },
    {
      itemId: 'item-8',
      platform: 'מקור (וואטסאפ)',
      url: 'https://whatsapp.com',
      title: 'התראת קבוצה',
      contentText: 'הודעה פנימית שהופצה בקבוצת העדכונים',
      authorName: 'מנהל קבוצה',
      sourceId: 'src-8',
      publishedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    },
    {
      itemId: 'item-9',
      platform: 'מקור (הארץ)',
      url: 'https://haaretz.co.il',
      title: 'פרשנות וניתוח',
      contentText: 'מאמר פרשנות ראשוני בעקבות האירוע',
      authorName: 'פרשן בכיר',
      sourceId: 'src-9',
      publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      itemId: 'item-10',
      platform: 'מקור (ערוץ 14)',
      url: 'https://now14.co.il',
      title: 'דיווח מהשטח',
      contentText: 'כתבה מצולמת ועדכון נתונים נוסף',
      authorName: 'צוות חדשות',
      sourceId: 'src-10',
      publishedAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    },
  ],
  total: 10,
  page: 1,
  pageSize: 10,
};

export function EventSourcesMonitor({ event, useRealApi = false }: EventSourcesMonitorProps) {
  const [data, setData] = useState<SourcesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (useRealApi) {
          const response = await fetch(`/api/events/${event.eventId}/items`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result: SourcesResponse = await response.json();
          if (isMounted) setData(result);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 600));
          if (isMounted) setData(MOCK_SOURCES_RESPONSE);
        }
      } catch (err) {
        if (isMounted) {
          setError('אירעה שגיאה בטעינת הנתונים.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (event?.eventId) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [event.eventId, useRealApi]);

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (e) {
      return '--:--';
    }
  };

  return (
    <Card
      dir="rtl"
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 2px 15px -3px rgba(0,0,0,0.1)',
        border: '1px solid #f1f5f9',
        fontFamily: 'inherit',
        overflow: 'hidden',
      }}
    >
      {/* Header Section */}
      <Box sx={{ px: 3, pt: 3, pb: 1.5, textAlign: 'right', flexShrink: 0 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 'bold',
            color: '#1e293b',
            lineHeight: 1.2,
            fontSize: 28,
          }}
        >
          ניטור אירוע
        </Typography>
        <Typography
          sx={{
            fontSize: 17,
            color: '#475569',
            mt: 0.5,
          }}
        >
          פרסומים חדשים
        </Typography>
      </Box>

      {/* Main Divider beneath header */}
      <Box sx={{ px: 2, flexShrink: 0 }}>
        <Divider sx={{ borderColor: '#f1f5f9', mb: 1 }} />
      </Box>

      {/* Content Section */}
      <Box 
        sx={{ 
          px: 2, 
          pb: 2, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden' 
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <CircularProgress sx={{ color: '#1e293b' }} />
            <Typography sx={{ fontSize: 14, color: '#64748b' }}>
              טוען נתונים...
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              textAlign: 'center',
              color: 'error.main',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {error}
          </Box>
        ) : (
          <List
            disablePadding
            sx={{
              height: '100%', 
              overflowY: 'auto',
              pr: 0.5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {data?.items.map((item, index) => (
              <React.Fragment key={item.itemId}>
                <ListItem
                  disablePadding
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 2.25,
                    px: 1,
                    borderRadius: 1.5,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 44,
                        height: 44,
                        backgroundColor: '#eef2f6',
                        borderRadius: 1.5,
                      }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: '#1e293b',
                          fontSize: 15,
                          lineHeight: 1,
                        }}
                      >
                        {item.platform || 'מקור'}
                      </Typography>
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="none"
                        sx={{
                          color: '#64748b',
                          fontSize: 14,
                          lineHeight: 1,
                          transition: 'color 0.2s',
                          '&:hover': {
                            color: '#1e293b',
                          },
                        }}
                      >
                        קישור
                      </Link>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      color: '#475569',
                      fontSize: 15,
                    }}
                  >
                    {formatTime(item.publishedAt)}
                  </Typography>
                </ListItem>
                {index < (data?.items.length ?? 0) - 1 && (
                  <Divider sx={{ borderColor: '#f1f5f9' }} />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Card>
  );
}