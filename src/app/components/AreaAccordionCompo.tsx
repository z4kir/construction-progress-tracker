import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import LineCompo from "./LineCompo";
import type { LineItem } from "../model/LineItem";
type Props = {
  id: string;
  label: string;
  title: string;
  progress: number;
  checked?: boolean;
  onCheckChange?: (checked: boolean) => void;
};

const AreaAccordionCompo = ({
  id,
  label,
  title,
  progress,
  checked = false,
  onCheckChange,
}: Props) => {
  const lineItems: LineItem[] = [
    {
      id: "1",
      title: "Concrete Flooring",
      quantity: 1200,
      unit: "sqft",
      status: "DONE",
      completed: true,
      remarks: "Curing complete",
    },
    {
      id: "2",
      title: "Waterproofing",
      quantity: 1200,
      unit: "sqft",
      status: "DONE",
      completed: true,
      remarks: "",
    },
  ];
  return (
    <div>
      <Accordion className="my-2" type="single" collapsible>
        <AccordionItem
          value={id}
            className="border rounded-md bg-gray-50  shadow-sm"
        >
          <AccordionTrigger className="border  bg-gray-50 px-4 py-4 shadow-sm transition-shadow hover:shadow-md hover:bg-muted hover:no-underline  rounded-md">
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`checkbox-${id}`}
                    checked={checked}
                    onChange={(e) => e.stopPropagation()}
                    onCheckedChange={(val) => onCheckChange?.(!!val)}
                  />
                  <label
                    htmlFor={`checkbox-${id}`}
                    className="text-sm font-medium"
                  >
                    {label}
                  </label>
                </div>

                <h3 className="text-lg font-bold">{title}</h3>

                <div className="flex items-center gap-2">
                  <Progress value={progress} className="w-40 h-2" />
                  <span className="text-sm">{progress}%</span>
                </div>
              </div>

              {/* <AccordionTrigger className="w-auto px-2" /> */}
            </div>
          </AccordionTrigger>
          <AccordionContent className="mt-4 text-sm text-muted-foreground overflow-auto">
            {/* Expandable content here if needed */}
            <div className="px-4">
            <LineCompo
              items={lineItems}
              onChange={(updatedItem) => console.log("Changed:", updatedItem)}
            />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AreaAccordionCompo;
