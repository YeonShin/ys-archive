import React from 'react';

import { UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ProjectFormData } from '../../types';

interface ProjectLinksProps {
  register: UseFormRegister<ProjectFormData>;
}

export const ProjectLinks = ({ register }: ProjectLinksProps) => {
  return (
    <div className="border-admin-border grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2">
      <div>
        <Label htmlFor="links.github" className="text-admin-text mb-1 block text-sm font-bold">
          Github URL (선택)
        </Label>
        <Input
          id="links.github"
          {...register('links.github')}
          className="bg-admin-card border-admin-border"
          placeholder="https://github.com/..."
        />
      </div>
      <div>
        <Label htmlFor="links.service" className="text-admin-text mb-1 block text-sm font-bold">
          서비스 URL (선택)
        </Label>
        <Input
          id="links.service"
          type="url"
          {...register('links.service')}
          className="bg-admin-card border-admin-border"
          placeholder="https://..."
        />
      </div>
    </div>
  );
};
