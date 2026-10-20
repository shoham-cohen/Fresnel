import React, { useState, useEffect } from 'react';
import type { EventSummary } from '../../api/events';

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
  /** Set to true to switch back to real API calls */
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
      publishedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    },
    {
      itemId: 'item-2',
      platform: 'מקור (טלגרם)',
      url: 'https://telegram.org',
      title: 'עדכון מערכתי',
      contentText: 'פרטי עדכון שהתקבלו מערוץ הדיווחים',
      authorName: 'ערוץ חירום',
      sourceId: 'src-2',
      publishedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 min ago
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
          // Real API fetch
          const response = await fetch(`/api/events/${event.eventId}/items`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result: SourcesResponse = await response.json();
          if (isMounted) setData(result);
        } else {
          // Simulated Mock API delay (600ms)
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

  // Helper to format time to HH:mm
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
    <div
      dir="rtl"
      className="w-full max-w-[420px] bg-white rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] border border-slate-100 font-sans overflow-hidden"
    >
      {/* Header Section */}
      <div className="px-6 pt-6 pb-3 text-right">
        <h2 className="text-[28px] font-bold text-[#1e293b] leading-tight">
          ניטור אירוע
        </h2>
        <p className="text-[17px] text-[#475569] mt-0.5">
          פרסומים חדשים
        </p>
      </div>

      {/* Content Section */}
      <div className="px-4">
        {/* Main Divider beneath header */}
        <div className="w-full h-px bg-slate-100 mb-2"></div>

        {loading ? (
          <div className="flex flex-col gap-4 p-4 items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-[#1e293b] rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500">טוען נתונים...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 min-h-[300px] flex items-center justify-center">
            {error}
          </div>
        ) : (
          <ul className="flex flex-col max-h-[500px] overflow-y-auto pr-1">
            {data?.items.map((item, index) => (
              <React.Fragment key={item.itemId}>
                <li className="flex items-center justify-between py-[18px] px-2 hover:bg-slate-50 transition-colors rounded-md">
                  {/* Right side content (in RTL) */}
                  <div className="flex items-center gap-4">
                    {/* Placeholder rounded square */}
                    <div className="w-11 h-11 bg-[#eef2f6] rounded-[6px] shrink-0"></div>

                    {/* Texts */}
                    <div className="flex flex-col leading-tight gap-1">
                      <span className="font-bold text-[#1e293b] text-[15px]">
                        {item.platform || 'מקור'}
                      </span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#64748b] text-[14px] hover:text-[#1e293b] transition-colors"
                      >
                        קישור
                      </a>
                    </div>
                  </div>

                  {/* Left side content (in RTL) - Time */}
                  <span className="text-[#475569] text-[15px]">
                    {formatTime(item.publishedAt)}
                  </span>
                </li>

                {/* Internal dividers between list items */}
                {index < (data?.items.length ?? 0) - 1 && (
                  <div className="w-full h-px bg-slate-100"></div>
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom padding to match the card feel */}
      <div className="h-4"></div>
    </div>
  );
}