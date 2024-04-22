interface RuleSectionInterface {
  title?: string;
  description?: string;
  icon?: string;
  clickableText?: string;
  onClickableTextPressed?: () => void;
  testID?: string;
}

export type RuleSectionTypes = RuleSectionInterface;
