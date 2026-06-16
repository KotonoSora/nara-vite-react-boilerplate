export interface LegalSection {
  id: string;
  title: string;
  content?: string;
  items?: string[];
  subsections?: {
    title: string;
    items: string[];
  }[];
}

export interface UseLegalReaderProps {
  sections: LegalSection[];
  title: string;
  description: string;
}
