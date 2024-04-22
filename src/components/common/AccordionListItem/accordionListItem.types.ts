
export interface AccordionListItemProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  activeItem?: string;
  id: string;
  onSelect?: (id: string) => void;
}
