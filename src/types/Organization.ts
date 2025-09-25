/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Organization {
  _id: string;
  name: string;
  styles: Record<string, any>;
  author: string;
  user_properties: Array<any>;
}
