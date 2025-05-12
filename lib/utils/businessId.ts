import { FinnishBusinessIds } from 'finnish-business-ids';

export const validateAndFormatBusinessId = (input: string): { isValid: boolean; formattedId?: string } => {
  // Remove spaces and hyphens
  const cleanInput = input.replace(/[\s-]/g, '');
  
  if (!cleanInput) {
    return { isValid: false };
  }

  // Check if input matches Finnish Business ID format
  const isValid = FinnishBusinessIds.isValidBusinessId(cleanInput);
  
  if (!isValid) {
    return { isValid: false };
  }

  // Format business ID with hyphen
  const formattedId = FinnishBusinessIds.formatBusinessId(cleanInput);
  
  return {
    isValid: true,
    formattedId
  };
};

export const isBusinessId = (input: string): boolean => {
  // Remove spaces and hyphens
  const cleanInput = input.replace(/[\s-]/g, '');
  
  // Basic format check (7-8 digits)
  if (!/^\d{7,8}$/.test(cleanInput)) {
    return false;
  }

  return FinnishBusinessIds.isValidBusinessId(cleanInput);
};

export const formatBusinessId = (input: string): string => {
  return FinnishBusinessIds.formatBusinessId(input);
};