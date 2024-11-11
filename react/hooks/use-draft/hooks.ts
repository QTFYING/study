import { useRef } from 'react';
import { DraftConstr, IDraftInstance } from './draft';

export const useDraft = (draft?: IDraftInstance) => {
  const draftRef = useRef<IDraftInstance | undefined>(draft);
  draftRef.current = draft || new DraftConstr();
  return [draftRef.current];
};
