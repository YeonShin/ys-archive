import { createClient } from '@/lib/supabase/server';

import { Contact, ContactSectionData } from '../type';

export const fetchContactData = async (): Promise<ContactSectionData | null> => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from('contact').select('*');

    if (error || !data) {
      console.error('[contactApi.fetchContactData] Failed to fetch contact data:', error);
      return null;
    }

    const contact: Contact[] = data.map((item) => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      url: item.url,
      description: item.description ? item.description : undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at ?? item.created_at,
    }));

    return { contact };
  } catch (error) {
    console.error('[contactApi.fetchContactData] Unexpected error during fetch:', error);
    return null;
  }
};
