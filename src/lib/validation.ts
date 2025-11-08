export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

/**
 * Valida un campo requerido
 */
export function validateRequired(value: any, fieldName: string): ValidationError | null {
  if (value === null || value === undefined || value === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
    };
  }
  return null;
}

/**
 * Valida un rango numérico
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationError | null {
  if (value < min || value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max}`,
    };
  }
  return null;
}

/**
 * Valida una fecha
 */
export function validateDate(value: string, fieldName: string): ValidationError | null {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid date`,
    };
  }
  return null;
}

/**
 * Valida un email
 */
export function validateEmail(value: string, fieldName: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid email`,
    };
  }
  return null;
}

/**
 * Valida un proyecto
 */
export function validateProject(project: {
  name: string;
  owner: string;
  estimatedDate: string;
  priority: string;
  status: string;
  progress?: number;
  tasksTotal?: number;
  tasksCompleted?: number;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  const nameError = validateRequired(project.name, 'name');
  if (nameError) errors.push(nameError);

  const ownerError = validateRequired(project.owner, 'owner');
  if (ownerError) errors.push(ownerError);

  const dateError = validateDate(project.estimatedDate, 'estimatedDate');
  if (dateError) errors.push(dateError);

  // Progress range
  if (project.progress !== undefined) {
    const progressError = validateRange(project.progress, 0, 100, 'progress');
    if (progressError) errors.push(progressError);
  }

  // Tasks validation
  if (project.tasksTotal !== undefined && project.tasksTotal < 0) {
    errors.push({
      field: 'tasksTotal',
      message: 'Total tasks must be a positive number',
    });
  }

  if (project.tasksCompleted !== undefined && project.tasksCompleted < 0) {
    errors.push({
      field: 'tasksCompleted',
      message: 'Completed tasks must be a positive number',
    });
  }

  if (
    project.tasksCompleted !== undefined &&
    project.tasksTotal !== undefined &&
    project.tasksCompleted > project.tasksTotal
  ) {
    errors.push({
      field: 'tasksCompleted',
      message: 'Completed tasks cannot exceed total tasks',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

