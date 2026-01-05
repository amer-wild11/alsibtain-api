import { BadRequestException } from '@nestjs/common';

type LangObject = {
  ar?: string;
  en?: string;
};

interface ValidateLangOptions {
  isUpdate?: boolean;
  messages?: {
    required?: string;
    arRequired?: string;
    enRequired?: string;
  };
}

export function validateLangFields(
  data: Record<string, any>,
  fields: string[],
  options: ValidateLangOptions = {},
) {
  const fieldErrors: Record<string, string[]> = {};
  const { isUpdate = false, messages = {} } = options;

  for (const field of fields) {
    const value: LangObject | undefined = data[field];

    if (isUpdate && value === undefined) continue;

    if (!value || typeof value !== 'object') {
      fieldErrors[field] = [messages.required ?? 'Field is required'];
      continue;
    }

    const hasAr = value.ar !== undefined && value.ar !== '';
    const hasEn = value.en !== undefined && value.en !== '';

    if (!hasAr) {
      fieldErrors[`${field}.ar`] = [
        messages.arRequired ?? 'Arabic value is required',
      ];
    }

    if (!hasEn) {
      fieldErrors[`${field}.en`] = [
        messages.enRequired ?? 'English value is required',
      ];
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new BadRequestException({
      message: 'Validation failed',
      fieldErrors,
    });
  }
}
