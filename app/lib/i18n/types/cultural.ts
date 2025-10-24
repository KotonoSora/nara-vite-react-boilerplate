// Cultural address formatting patterns
export interface AddressFormat {
  order: string[]; // Order of address components
  separator: string; // Main separator between components
  lineSeparator: string; // Line break separator
  postalCodeFormat?: RegExp; // Postal code validation pattern
}

// Phone number formatting patterns
export interface PhoneFormat {
  pattern: RegExp;
  format: string; // Format string with placeholders
  example: string;
  countryCode: string;
}

// Name formatting conventions
export interface NameFormat {
  order: string[]; // Order of name components
  separator: string;
  honorifics: string[];
  example: string;
}

// Address interface
export interface Address {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}
