'use server';

import { createClient } from '@/lib/supabase/server';

import { LoginFormData } from '../type';

export async function loginAdminAction(data: LoginFormData) {
  const { email, password } = data;

  if (!email || !password) {
    return { success: false, error: '이메일과 비밀번호를 입력해주세요.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function logoutAdminAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function resetPasswordAction(email: string) {
  if (!email) {
    return { success: false, error: '이메일을 입력해주세요.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updatePasswordAction(password: string) {
  if (!password) {
    return { success: false, error: '비밀번호를 입력해주세요.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
