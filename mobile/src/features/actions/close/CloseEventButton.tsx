import { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Button } from '@/components/Button';
import { CLOSE_EVENT_LABEL } from '@/constants/labels';
import { CloseEventSheet } from './CloseEventSheet';

type Props = {
  eventId: string;
  style?: StyleProp<ViewStyle>;
};

export function CloseEventButton({ eventId, style }: Props) {
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  return (
    <>
      <Button
        label={CLOSE_EVENT_LABEL.button}
        icon="close-circle-outline"
        variant="secondary"
        onPress={() => setIsSheetVisible(true)}
        style={style}
      />
      <CloseEventSheet
        eventId={eventId}
        isVisible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
      />
    </>
  );
}
