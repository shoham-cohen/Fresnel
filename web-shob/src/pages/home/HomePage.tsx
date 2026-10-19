import { useSearchParams } from 'react-router';

import { NarrativeDetailsPanel } from '@/features/narratives';

export function HomePage() {
  const [, setSearchParams] = useSearchParams();

  /*
   * The narratives table will be written by someone else and placed here.
   * Clicking a row in the table sets ?narrativeId=<id> in the URL,
   * which automatically triggers NarrativeDetailsPanel to slide open.
   */
  return (
    <>
      <title>מסך ראשי · Palantir</title>
      <div style={{ padding: '24px 32px' }}>
        <h1>מסך ראשי</h1>

        {/* Demo row trigger until the table component is plugged in */}
        <div style={{ marginBlockStart: '20px' }}>
          <button
            type="button"
            onClick={() => {
              setSearchParams({ narrativeId: 'nar-0001' });
            }}
            style={{
              padding: '10px 18px',
              backgroundColor: '#f2f2f2',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
              fontFamily: 'inherit',
            }}
          >
            פתח פאנל התראה לדוגמה (עלייה חריגה בשיח סביב פעילות צהל בגבול הצפון)
          </button>
        </div>
      </div>

      <NarrativeDetailsPanel />
    </>
  );
}
