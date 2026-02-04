export type QRInputSectionProps = {
  text: string;
  maxLength: number;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};
