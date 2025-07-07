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
import type { FormChangeItem } from "../model/FormChangeItem";
import type { LineItem } from "../model/LineItem";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

type Props = {
  items: LineItem[];
  // onChange?: (item: LineItem) => void;
  formChange: (obj: FormChangeItem) => void;
  areaIndex: number;
  floorIndex?: number;
  flatIndex?: number;
};

const LineCompo = ({
  items,
  formChange,
  areaIndex,
  flatIndex,
  floorIndex,
}: Props) => {
  const currentTab = useSelector((state: RootState) => state.tab.currentTab);
  console.log(currentTab);

  const formatDateForInput = (isoDate: string | undefined | null): string => {
    if (!isoDate) return ""; // prevent NaN

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return ""; // invalid date

    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const toISODateUTC = (localDateTime: string) => {
    return new Date(localDateTime).toISOString(); // → '2025-01-20T03:30:00.000Z' (example for IST)
  };
  return (
    <div className="px-1 overflow-x-auto border rounded-md">
      <Table>
        <TableHeader className=" text-center">
          <TableRow>
            <TableHead className=" text-center">LINE ITEM</TableHead>
            <TableHead className=" text-center">PLANNED QTY</TableHead>
            {currentTab === "without_qty" && (
              <TableHead className=" text-center">Add New Qty</TableHead>
            )}
            <TableHead className=" text-center">STATUS</TableHead>
            <TableHead className="text-center">COMPLETED</TableHead>
            <TableHead className="text-center">Start Date</TableHead>
            <TableHead className="text-center">Completed Date</TableHead>
            <TableHead className=" text-center">REMARKS</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-center font-medium">
                {item.name}
              </TableCell>
              <TableCell className=" text-center">
                {item.plannedQuantity.value} {item.plannedQuantity.unit}
              </TableCell>
              {currentTab === "without_qty" && (
                <TableCell className=" text-center">
                  <Input
                    type="number"
                    value={item?.addQuantity?.value}
                    onChange={(e) => {
                      if (item.addQuantity) {
                        item.addQuantity.value = Number(e.target.value);
                        let changeObj: FormChangeItem = {
                          area: "LINE",
                          isCheckChange: false,
                          floorIndex: floorIndex,
                          flateIndex: flatIndex,
                          areaIndex: areaIndex,
                        };
                        formChange(changeObj);
                      }
                    }}
                  />{" "}
                </TableCell>
              )}
              <TableCell className=" text-center">
                <Badge
                  variant={
                    item.status === "COMPLETED"
                      ? "success"
                      : item.status === "PENDING"
                      ? "danger"
                      : "warning"
                  }
                  className="rounded-full px-3"
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  checked={item.isCompleted}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={(val) => {
                    let newVal = !!val;
                    item.isCompleted = newVal;
                    let changeObj: FormChangeItem = {
                      value: newVal,
                      area: "LINE",
                      isCheckChange: true,
                      floorIndex: floorIndex,
                      flateIndex: flatIndex,
                      areaIndex: areaIndex,
                      lineIndex: index,
                    };
                    formChange(changeObj);
                  }}
                  className="border-primary hover:border-[1.5px] hover:cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-white "
                />
              </TableCell>
              <TableCell className=" text-center">
                <Input
                  className="w-auto"
                  type="datetime-local"
                  value={formatDateForInput(item.estimatedStartDate)}
                  onChange={(e) => {
                    console.log(e.target.value);

                    item.estimatedStartDate = toISODateUTC(e.target.value);
                    let changeObj: FormChangeItem = {
                      area: "LINE",
                      isCheckChange: false,
                      floorIndex: floorIndex,
                      flateIndex: flatIndex,
                      areaIndex: areaIndex,
                    };
                    formChange(changeObj);
                  }}
                  placeholder="Enter remarks"
                />
              </TableCell>
              <TableCell className=" text-center">
                <Input
                  className="w-auto bg-muted"
                  type="datetime-local"
                  readOnly={true}
                  value={formatDateForInput(item.completedDate)}
                  placeholder="Enter remarks"
                />
              </TableCell>
              <TableCell className=" text-center">
                <Input
                  className="w-auto"
                  value={item.remarks}
                  onChange={(e) => {
                    item.remarks = e.target.value;
                    let changeObj: FormChangeItem = {
                      area: "LINE",
                      isCheckChange: false,
                      floorIndex: floorIndex,
                      flateIndex: flatIndex,
                      areaIndex: areaIndex,
                    };
                    formChange(changeObj);
                  }}
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
