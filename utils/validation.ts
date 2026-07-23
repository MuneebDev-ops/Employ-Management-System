export interface ValidationErrors {
  [key: string]: string;
}

export const validators = {
  required: (value: any, fieldName: string): string | null => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value) return null; // Let 'required' validator handle empty values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email format';
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (!value) return null; // Let 'required' validator handle empty values
    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (!value) return null;
    if (value.length > max) {
      return `${fieldName} must be at most ${max} characters`;
    }
    return null;
  },

  minValue: (value: number, min: number, fieldName: string): string | null => {
    if (value < min) {
      return `${fieldName} must be at least ${min}`;
    }
    return null;
  },

  maxValue: (value: number, max: number, fieldName: string): string | null => {
    if (value > max) {
      return `${fieldName} must be at most ${max}`;
    }
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return null;
    // Basic phone validation - can be customized
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value)) {
      return 'Invalid phone format';
    }
    return null;
  },
};

// Helper to run multiple validators on a single field
export const validateField = (
  value: any,
  validationRules: Array<() => string | null>
): string | null => {
  for (const rule of validationRules) {
    const error = rule();
    if (error) return error;
  }
  return null;
};

// Validate entire form
export const validateForm = (
  formData: Record<string, any>,
  rules: Record<string, Array<(value: any) => string | null>>
): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  for (const [field, validationRules] of Object.entries(rules)) {
    const value = formData[field];
    const error = validateField(value, validationRules);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
