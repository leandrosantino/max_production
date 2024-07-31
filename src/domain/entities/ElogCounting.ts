export interface ElogCounting{
  date: Date;
  partNumber: string;
  description: string;
  demands: {
      date: Date;
      qunatity: number;
  }[];
  total: number
}
