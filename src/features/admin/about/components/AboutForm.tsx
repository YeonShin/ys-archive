'use client';

import React from 'react';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useAboutForm } from '../hooks/useAboutForm';
import { AboutFormData } from '../types';
import { AboutContactsSection } from './AboutContactsSection';
import { AboutPortfolioSection } from './AboutPortfolioSection';

interface AboutFormProps {
  initialData: AboutFormData;
}

const AboutForm = ({ initialData }: AboutFormProps) => {
  const { form, contactsFieldArray, fileStates, handlers, isSubmitting, isDirty } =
    useAboutForm(initialData);

  const { handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit(handlers.onSubmit)} className="space-y-12">
      <AboutPortfolioSection form={form} fileStates={fileStates} handlers={handlers} />

      <AboutContactsSection form={form} contactsFieldArray={contactsFieldArray} />

      <div className="flex justify-end">
        <Button
          variant="secondary"
          type="submit"
          size="lg"
          disabled={
            isSubmitting || (!isDirty && !fileStates.profileImageFile && !fileStates.resumeFile)
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            '변경사항 저장'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AboutForm;
