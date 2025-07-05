import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LineItem } from "../model/LineItem";

type Props = {
  items: LineItem[];
  onChange?: (item: LineItem) => void;
};

const LineCompo = ({ items, onChange }: Props) => {
  const handleCheck = (id: string, checked: boolean) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, completed: checked } : item
    );
    onChange?.(updated.find((i) => i.id === id)!);
  };

  const handleRemarks = (id: string, text: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, remarks: text } : item
    );
    onChange?.(updated.find((i) => i.id === id)!);
  };
  return (
    <div className="px-1 overflow-x-auto border rounded-md">
      <Table>
        <TableHeader   className=" text-center">
          <TableRow >
            <TableHead className=" text-center">LINE ITEM</TableHead>
            <TableHead className=" text-center">PLANNED QTY</TableHead>
            <TableHead className=" text-center">STATUS</TableHead>
            <TableHead className="text-center">COMPLETED</TableHead>
            <TableHead className=" text-center">REMARKS</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-center font-medium">{item.title}</TableCell>
              <TableCell className=" text-center">
                {item.quantity} {item.unit}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="rounded-full px-3">
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={(val) => handleCheck(item.id, Boolean(val))}
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                />
              </TableCell>
              <TableCell className=" text-center">
                <Input
                className="w-auto"
                  value={item.remarks}
                  onChange={(e) => handleRemarks(item.id, e.target.value)}
                  placeholder="Enter remarks"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LineCompo;
