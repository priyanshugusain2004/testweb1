/**
 * Input Validation Utilities
 * Prevents XSS, SQL injection, and other input-based attacks
 */

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters and scripts
  return input
    .replace(/[<>]/g, '')  // Remove angle brackets
    .trim()
    .slice(0, 500);  // Limit length
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 255;
}

/**
 * Validate number input within range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - Whether value is in valid range
 */
export function validateNumberInRange(value, min, max) {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Validate age (1-150)
 * @param {number} age - Age to validate
 * @returns {boolean} - Whether age is valid
 */
export function validateAge(age) {
  return validateNumberInRange(age, 1, 150);
}

/**
 * Validate steps count
 * @param {number} steps - Steps count
 * @returns {boolean} - Whether steps is valid
 */
export function validateSteps(steps) {
  return validateNumberInRange(steps, 0, 1000000);
}

/**
 * Validate water intake (0-100 liters)
 * @param {number} liters - Water intake in liters
 * @returns {boolean} - Whether water intake is valid
 */
export function validateWaterIntake(liters) {
  return validateNumberInRange(liters, 0, 100);
}

/**
 * Validate duration in minutes (0-1440 = 24 hours)
 * @param {number} minutes - Duration in minutes
 * @returns {boolean} - Whether duration is valid
 */
export function validateDuration(minutes) {
  return validateNumberInRange(minutes, 0, 1440);
}

/**
 * Validate height in cm (100-250)
 * @param {number} height - Height in cm
 * @returns {boolean} - Whether height is valid
 */
export function validateHeight(height) {
  return validateNumberInRange(height, 100, 250);
}

/**
 * Validate weight in kg (30-500)
 * @param {number} weight - Weight in kg
 * @returns {boolean} - Whether weight is valid
 */
export function validateWeight(weight) {
  return validateNumberInRange(weight, 30, 500);
}

/**
 * Create a safe form data object with validation
 * @param {object} data - Raw form data
 * @param {object} validators - Object with field validators
 * @returns {object} - Validated and sanitized data
 */
export function createSafeFormData(data, validators) {
  const result = {};
  
  for (const [key, validator] of Object.entries(validators)) {
    const value = data[key];
    
    if (validator(value)) {
      result[key] = value;
    } else {
      throw new Error(`Invalid value for field: ${key}`);
    }
  }
  
  return result;
}
