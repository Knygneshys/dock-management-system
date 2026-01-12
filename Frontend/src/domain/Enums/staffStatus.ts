export const StaffStatus = {
    AVAILABLE: 0,
    UNAVAILABLE: 1,
    ON_LEAVE: 2,
    UNDER_TRAINING: 3
  } as const;

  export type StaffStatus = (typeof StaffStatus)[keyof typeof StaffStatus];
