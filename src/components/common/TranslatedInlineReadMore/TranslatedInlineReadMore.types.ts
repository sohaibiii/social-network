import { InlineReadMoreProps } from "~/components/common/InlineReadMore/InlineReadMore.types";
export interface Match {
  getType(): string;
}

interface InlineReadMoreInterface extends InlineReadMoreProps {
  originalDescription?: string;
  description?: string;
  handleCopy?: (_copiedText: string) => void;
  translationSource?: string;
}

export type TranslatedInlineReadMoreProps = InlineReadMoreInterface;
