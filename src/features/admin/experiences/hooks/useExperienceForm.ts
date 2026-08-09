import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { ExperienceItem } from '@/features/portfolio/experiences/types';

import { ExperienceFormData, experiencesFormSchema } from '../types';

export const useExperienceForm = () => {
  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experiencesFormSchema),
    defaultValues: {
      title: '',
      organization: '',
      description: '',
      started_at: '',
      ended_at: '',
      tech_stacks: [{ value: '' }],
      details: [{ value: '' }],
    },
  });

  const {
    fields: techStacks,
    append: appendTechStack,
    remove: removeTechStack,
  } = useFieldArray({
    control: form.control,
    name: 'tech_stacks',
  });

  const {
    fields: details,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({
    control: form.control,
    name: 'details',
  });

  const endedAt = useWatch({
    control: form.control,
    name: 'ended_at',
  });
  const isCurrent = endedAt === null;

  const resetFormToInitial = () => {
    form.reset({
      title: '',
      organization: '',
      description: '',
      started_at: '',
      ended_at: '',
      tech_stacks: [{ value: '' }],
      details: [{ value: '' }],
    });
  };

  const resetFormWithItem = (item: ExperienceItem) => {
    form.reset({
      title: item.title,
      organization: item.organization,
      description: item.description,
      started_at: item.startedAt,
      // null 값 처리
      ended_at: item.endedAt,
      tech_stacks: item.techStacks?.length
        ? item.techStacks.map((t) => ({ value: t }))
        : [{ value: '' }],
      details: item.details?.length ? item.details.map((d) => ({ value: d })) : [{ value: '' }],
    });
  };

  return {
    form,
    techStacks,
    appendTechStack,
    removeTechStack,
    details,
    appendDetail,
    removeDetail,
    isCurrent,
    resetFormToInitial,
    resetFormWithItem,
  };
};
