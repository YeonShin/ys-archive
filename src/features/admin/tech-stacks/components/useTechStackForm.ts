import { useState } from 'react';

import { TechStack } from '../types';

export const useTechStackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TechStack | undefined>(undefined);

  const openForm = (item?: TechStack) => {
    setEditingItem(item);
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setEditingItem(undefined);
  };

  return { isOpen, editingItem, openForm, closeForm };
};
