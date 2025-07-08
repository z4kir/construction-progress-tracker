type Choice = { label: string; value: string }[];
export type FilterItem = {
  lineItemFilter: { value: string; choice: Choice };
  statusFilter: { value: string; choice: Choice };
  quickAction: { value: string; choice: Choice };
};
