import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterItem } from "../model/FilterItem";

type Props = {
  filterItem: FilterItem;
  filterChange: (value: string, type: string) => void;
};

const FilterCompo = ({ filterItem, filterChange }: Props) => {
  return (
    <Card className="m-4 p-3 w-full shadow-sm gap-2 h-fit">
      <CardHeader className="px-2">
        <CardTitle className="text-lg text-center">
          Filters & Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-2">
        {/* <h2 className="text-lg font-semibold"></h2> */}
        {/* Filter by Line Item */}
        <div className="space-y-2">
          <Label htmlFor="line-item">Filter by Line Item</Label>
          <Select
            value={filterItem.lineItemFilter?.value}
            onValueChange={(val) => {
              filterChange(val, "line");
            }}
          >
            <SelectTrigger id="line-item" className="w-full">
              <SelectValue placeholder="All line items" />
            </SelectTrigger>
            <SelectContent>
              {filterItem.lineItemFilter.choice.map((obj, index) => (
                <SelectItem key={index} value={obj.value}>
                  {obj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Show Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Show Status</Label>
          <Select
            value={filterItem.statusFilter?.value}
            onValueChange={(val) => {
              filterChange(val, "status");
            }}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {filterItem.statusFilter.choice.map((obj, index) => (
                <SelectItem key={index} value={obj.value}>
                  {obj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Label htmlFor="actions">Quick Actions</Label>
          <Select
            value={filterItem.quickAction?.value}
            onValueChange={(val) => {
              filterChange(val, "quick");
            }}
          >
            <SelectTrigger id="actions" className="w-full">
              <SelectValue placeholder="Choose action" />
            </SelectTrigger>
            <SelectContent>
              {filterItem.quickAction.choice.map((obj, index) => (
                <SelectItem key={index} value={obj.value}>
                  {obj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterCompo;
