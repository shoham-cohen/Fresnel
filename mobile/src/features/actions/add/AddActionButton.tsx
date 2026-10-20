import { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Button } from '@/components/Button';
import { ADD_ACTION_LABEL } from '@/constants/labels';
import { AddActionSheet } from './AddActionSheet';

type Props = {
  eventId: string;
  style?: StyleProp<ViewStyle>;
};

export function AddActionButton({ eventId, style }: Props) {
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  return (
    <>
      <Button
        label={ADD_ACTION_LABEL.button}
        icon="add"
        onPress={() => setIsSheetVisible(true)}
        style={style}
      />
      <AddActionSheet
        eventId={eventId}
        isVisible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
      />
    </>
  );
}
