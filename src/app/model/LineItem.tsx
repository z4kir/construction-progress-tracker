export type LineItem = {
  id: string;
  name: string;
  category: string;
  plannedQuantity: { value: number; unit: string };
  unit: string;
  status: string;
  isCompleted: boolean;
  remarks: string;
  completedDate: string;
  assignedTo: string;
};
