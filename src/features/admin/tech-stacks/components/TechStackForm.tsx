'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { TechStack } from '../types';

interface TechStackFormProps {
  techStack?: TechStack;
  isOpen: boolean;
  onClose: () => void;
}

const TechStackForm = ({ techStack, isOpen, onClose }: TechStackFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{techStack ? '기술 스택 수정' : '기술 스택 추가'}</DialogTitle>
        </DialogHeader>

        {/* 뼈대 폼: 실제 액션 연동은 아직 없음 */}
        <form onSubmit={(e) => e.preventDefault()}>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TechStackForm;
