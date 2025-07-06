import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {};

const FilterCompo = ({}: Props) => {
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
          <Select>
            <SelectTrigger id="line-item" className="w-full">
              <SelectValue placeholder="All line items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All line items</SelectItem>
              <SelectItem value="item-1">Item 1</SelectItem>
              <SelectItem value="item-2">Item 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Show Status</Label>
          <Select>
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Label htmlFor="actions">Quick Actions</Label>
          <Select>
            <SelectTrigger id="actions" className="w-full">
              <SelectValue placeholder="Choose action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="download">Download Report</SelectItem>
              <SelectItem value="reset">Reset Filters</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterCompo;
