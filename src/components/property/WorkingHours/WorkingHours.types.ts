export interface WorkingDay {
  timezone: string;
  from: string;
  to: string;
}

export interface WorkingHoursProps {
  isOpen: boolean;
  workingHours: Record<string, WorkingDay[]>;
}
