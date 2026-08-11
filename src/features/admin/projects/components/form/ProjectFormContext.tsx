'use client';
import { createContext, useContext } from 'react';

export interface ProjectFormContextType {
  registerFile: (blobUrl: string, file: File, folderPath: string) => void;
  unregisterFile: (blobUrl: string) => void;
}

export const ProjectFormContext = createContext<ProjectFormContextType | null>(null);

export const useProjectFormContext = () => {
  return useContext(ProjectFormContext);
};
