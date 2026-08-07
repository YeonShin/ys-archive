import { createClient } from '@/lib/supabase/server';

import { AboutFormData } from '../types';

export const getAboutData = async () => {
  try {
    const supabase = await createClient();

    const [portfolioRes, contactRes] = await Promise.all([
      supabase.from('portfolio_content').select('*').limit(1).single(),
      supabase.from('contact').select('*').order('created_at', { ascending: true }),
    ]);

    if (portfolioRes.error && portfolioRes.error.code !== 'PGRST116') {
      throw portfolioRes.error;
    }

    if (contactRes.error) {
      throw contactRes.error;
    }

    return {
      success: true,
      data: {
        portfolioContent: portfolioRes.data || null,
        contacts: contactRes.data || [],
      },
    };
  } catch (error: unknown) {
    console.error('[about.service.getAboutData]', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { message?: string })?.message || '데이터 조회 중 오류가 발생했습니다.';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const updateAboutData = async (data: AboutFormData) => {
  try {
    const supabase = await createClient();

    // 1. portfolio_content 업데이트
    const { error: portfolioError } = await supabase
      .from('portfolio_content')
      .update(data.portfolioContent)
      .eq('id', 1);

    if (portfolioError) {
      throw portfolioError;
    }

    // 2. contact 업데이트
    // 2-1. 기존 목록에 없는 항목 삭제 처리
    const existingContactIds = data.contacts
      .map((c) => c.id)
      .filter((id) => id && id.trim() !== '');

    let deleteError;
    if (existingContactIds.length > 0) {
      const { error } = await supabase
        .from('contact')
        .delete()
        .not('id', 'in', `(${existingContactIds.join(',')})`);
      deleteError = error;
    } else {
      // 모든 연락처를 지운 경우
      const { error } = await supabase.from('contact').delete().neq('id', 'dummy');
      deleteError = error;
    }

    if (deleteError) {
      throw deleteError;
    }

    // 2-2. Update existing contacts (with id) and Insert new contacts (without id)
    const contactsToUpdate = data.contacts.filter((c) => !!c.id);
    const contactsToInsert = data.contacts
      .filter((c) => !c.id)
      .map((c) => {
        const { id: _id, ...rest } = c;
        return rest;
      });

    if (contactsToUpdate.length > 0) {
      const { error: upsertError } = await supabase.from('contact').upsert(contactsToUpdate);
      if (upsertError) {
        throw upsertError;
      }
    }

    if (contactsToInsert.length > 0) {
      const { error: insertError } = await supabase.from('contact').insert(contactsToInsert);
      if (insertError) {
        throw insertError;
      }
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[about.service.updateAboutData]', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { message?: string })?.message || '업데이트 중 오류가 발생했습니다.';
    return {
      success: false,
      error: errorMessage,
    };
  }
};
