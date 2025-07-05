export type LineItem = {
  id: string;
  title: string;
  quantity: number;
  unit: string;
  status: "PENDING" | "IN PROGRESS" | "DONE";
  completed: boolean;
  remarks: string;
};
