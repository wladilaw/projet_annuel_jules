// Validators utilisant des types TypeScript stricts et des patterns modernes

// Regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/

// Validation errors types
export interface ValidationError {
  field: string
  message: string
  value?: any
}

export class ValidationResult {
  constructor(
    public isValid: boolean,
    public errors: ValidationError[] = []
  ) {}

  static success(): ValidationResult {
    return new ValidationResult(true)
  }

  static error(errors: ValidationError[]): ValidationResult {
    return new ValidationResult(false, errors)
  }

  addError(field: string, message: string, value?: any): void {
    this.errors.push({ field, message, value })
    this.isValid = false
  }
}

// Base validator class
abstract class BaseValidator<T> {
  abstract validate(data: T): ValidationResult

  protected validateRequired(value: any, fieldName: string): ValidationError | null {
    if (value === undefined || value === null || value === '') {
      return { field: fieldName, message: `${fieldName} est requis` }
    }
    return null
  }

  protected validateEmail(email: string): ValidationError | null {
    if (!EMAIL_REGEX.test(email)) {
      return { field: 'email', message: 'Format d\'email invalide' }
    }
    return null
  }

  protected validatePassword(password: string): ValidationError | null {
    if (!PASSWORD_REGEX.test(password)) {
      return {
        field: 'password',
        message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
      }
    }
    return null
  }

  protected validateStringLength(
    value: string,
    fieldName: string,
    minLength?: number,
    maxLength?: number
  ): ValidationError | null {
    if (minLength && value.length < minLength) {
      return { field: fieldName, message: `${fieldName} doit contenir au moins ${minLength} caractères` }
    }
    if (maxLength && value.length > maxLength) {
      return { field: fieldName, message: `${fieldName} ne peut pas dépasser ${maxLength} caractères` }
    }
    return null
  }
}

// User validators
export class UserValidator extends BaseValidator<any> {
  validate(data: any): ValidationResult {
    const result = new ValidationResult(true)

    // Validate required fields
    const requiredError = this.validateRequired(data.firstName, 'prénom')
    if (requiredError) result.addError(requiredError.field, requiredError.message)

    const lastNameError = this.validateRequired(data.lastName, 'nom')
    if (lastNameError) result.addError(lastNameError.field, lastNameError.message)

    const emailError = this.validateRequired(data.email, 'email')
    if (emailError) result.addError(emailError.field, emailError.message)

    // Validate email format
    if (data.email) {
      const emailFormatError = this.validateEmail(data.email)
      if (emailFormatError) result.addError(emailFormatError.field, emailFormatError.message)
    }

    // Validate string lengths
    if (data.firstName) {
      const lengthError = this.validateStringLength(data.firstName, 'prénom', 2, 50)
      if (lengthError) result.addError(lengthError.field, lengthError.message)
    }

    if (data.lastName) {
      const lengthError = this.validateStringLength(data.lastName, 'nom', 2, 50)
      if (lengthError) result.addError(lengthError.field, lengthError.message)
    }

    return result
  }

  validateForRegistration(data: any): ValidationResult {
    const result = this.validate(data)

    // Additional validation for registration
    const passwordError = this.validateRequired(data.password, 'mot de passe')
    if (passwordError) {
      result.addError(passwordError.field, passwordError.message)
    } else {
      const passwordFormatError = this.validatePassword(data.password)
      if (passwordFormatError) result.addError(passwordFormatError.field, passwordFormatError.message)
    }

    return result
  }
}

// CV validator
export class CVValidator extends BaseValidator<any> {
  validate(data: any): ValidationResult {
    const result = new ValidationResult(true)

    const fileNameError = this.validateRequired(data.fileName, 'nom du fichier')
    if (fileNameError) result.addError(fileNameError.field, fileNameError.message)

    const fileTypeError = this.validateRequired(data.fileType, 'type de fichier')
    if (fileTypeError) result.addError(fileTypeError.field, fileTypeError.message)

    const userIdError = this.validateRequired(data.userId, 'utilisateur')
    if (userIdError) result.addError(userIdError.field, userIdError.message)

    // Validate file type
    if (data.fileType && !['pdf', 'doc', 'docx', 'txt'].includes(data.fileType.toLowerCase())) {
      result.addError('fileType', 'Type de fichier non supporté')
    }

    return result
  }
}

// Job offer validator
export class JobOfferValidator extends BaseValidator<any> {
  validate(data: any): ValidationResult {
    const result = new ValidationResult(true)

    const titleError = this.validateRequired(data.title, 'titre')
    if (titleError) result.addError(titleError.field, titleError.message)

    const companyError = this.validateRequired(data.company, 'entreprise')
    if (companyError) result.addError(companyError.field, companyError.message)

    const locationError = this.validateRequired(data.location, 'localisation')
    if (locationError) result.addError(locationError.field, locationError.message)

    const userIdError = this.validateRequired(data.userId, 'utilisateur')
    if (userIdError) result.addError(userIdError.field, userIdError.message)

    // Validate string lengths
    if (data.title) {
      const lengthError = this.validateStringLength(data.title, 'titre', 5, 200)
      if (lengthError) result.addError(lengthError.field, lengthError.message)
    }

    if (data.description) {
      const lengthError = this.validateStringLength(data.description, 'description', 10, 5000)
      if (lengthError) result.addError(lengthError.field, lengthError.message)
    }

    return result
  }
}

// Export validator instances
export const userValidator = new UserValidator()
export const cvValidator = new CVValidator()
export const jobOfferValidator = new JobOfferValidator() 