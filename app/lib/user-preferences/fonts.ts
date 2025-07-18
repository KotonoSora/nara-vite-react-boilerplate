export interface FontOption {
  name: string;
  label: string;
  fallback: string;
}

export const availableFonts: FontOption[] = [
  { name: 'Inter', label: 'Inter (Default)', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Roboto', label: 'Roboto', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Open Sans', label: 'Open Sans', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Lato', label: 'Lato', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Poppins', label: 'Poppins', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Montserrat', label: 'Montserrat', fallback: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Source Sans Pro', label: 'Source Sans Pro', fallback: 'ui-sans-serif, system-ui, sans-serif' },
];

export interface FontSizeOption {
  value: number;
  label: string;
}

export const fontSizeOptions: FontSizeOption[] = [
  { value: 0.75, label: 'Small' },
  { value: 0.875, label: 'Medium' },
  { value: 1, label: 'Default' },
  { value: 1.125, label: 'Large' },
  { value: 1.25, label: 'Extra Large' },
];