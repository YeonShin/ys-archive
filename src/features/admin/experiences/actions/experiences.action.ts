'use server';

export type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createExperienceAction(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  // TODO: formData에서 'data' 필드를 추출하여 JSON 파싱 후 experiencesFormSchema로 검증 (safeParse)
  // TODO: 검증 실패 시 { success: false, errors: ... } 반환
  // TODO: 검증 성공 시 파싱된 데이터로 createExperience 서비스 호출
  // TODO: 에러 핸들링 (try-catch) 및 revalidatePath('/admin/experience') 호출
  return { success: false, message: '구현 필요' };
}

export async function updateExperienceAction(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  // TODO: formData에서 'id'와 'data' 추출 및 검증
  // TODO: updateExperience 서비스 호출
  // TODO: 에러 핸들링 및 revalidatePath 호출
  return { success: false, message: '구현 필요' };
}

export async function deleteExperienceAction(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  // TODO: formData에서 'id' 추출 및 숫자/UUID 여부 검증
  // TODO: deleteExperience 서비스 호출
  // TODO: 에러 핸들링 및 revalidatePath 호출
  return { success: false, message: '구현 필요' };
}
