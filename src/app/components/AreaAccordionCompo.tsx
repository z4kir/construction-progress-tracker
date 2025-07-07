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
import type { AreaItem } from "../model/AccordionItem";
import type { FormChangeItem } from "../model/FormChangeItem";
// type Props = {
//   id: string;
//   label: string;
//   title: string;
//   progress: number;
//   checked?: boolean;
//   onCheckChange?: (checked: boolean) => void;
// };

type Props = {
  areas: AreaItem[];
  formChange: (obj: FormChangeItem) => void;
  // onCheckChange?: (checked: boolean) => void;
  floorIndex?: number;
  flatIndex?: number;
};

const AreaAccordionCompo = ({
  areas,
  formChange,
  flatIndex,
  floorIndex,
}: Props) => {
  const areaChangeFn = (newVal: boolean, areaIndex: number) => {
    let changeObj: FormChangeItem = {
      value: newVal,
      area: "AREA",
      isCheckChange: true,
      floorIndex: floorIndex,
      flateIndex: flatIndex,
      areaIndex: areaIndex,
    };
    formChange(changeObj);
  };

  return (
    <div>
      {areas?.map((area, areaIndex) => (
        <Accordion
          key={areaIndex}
          className="my-2"
          type="single"
          value={area.collapse ? area.id : ""}
          onValueChange={(val) => {
            if (val === "") {
              area.collapse = false;
            } else {
              area.collapse = true;
            }
            let changeObj: FormChangeItem = {
              area: "AREA",
              isCheckChange: false,
            };
            formChange(changeObj);
          }}
          collapsible
        >
          <AccordionItem
            value={area.id}
            className="border rounded-md bg-gray-50   shadow-sm"
          >
            <AccordionTrigger className="border  bg-gray-50 px-4 py-4 shadow-sm transition-shadow hover:cursor-pointer hover:shadow-md hover:bg-muted hover:no-underline  rounded-md">
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`checkbox-${area.id}`}
                      className="border-primary hover:border-[1.5px] hover:cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-white "
                      checked={area.isCompleted}
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={(val) => {
                        let newVal: boolean = !!val;
                        area.isCompleted = newVal;
                        areaChangeFn(newVal, areaIndex);
                        // let changeObj: FormChangeItem = {
                        //   value: newVal,
                        //   area: "FLOOR",
                        //   isCheckChange: true,
                        //   floorIndex: floorIndex,
                        //   flateIndex: flatIndex,
                        //   areaIndex: areaIndex,
                        // };
                        // formChange(changeObj);
                      }}
                    />
                    <label
                      // htmlFor={`checkbox-${area.id}`}
                      className="text-sm font-medium hover:cursor-pointer"
                    >
                      Mark {area.name} Completed
                    </label>
                  </div>

                  <h3 className="text-lg font-bold">{area.name}</h3>

                  <div className="flex items-center gap-2">
                    <Progress value={area.progress} className="w-40 h-2" />
                    <span className="text-sm">{area.progress}%</span>
                  </div>
                </div>

                {/* <AccordionTrigger className="w-auto px-2" /> */}
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-4 text-sm bg-gray-50 overflow-auto">
              {/* Expandable content here if needed */}
              <div className="px-4">
                <LineCompo
                  items={area.lineItems}
                  formChange={formChange}
                  floorIndex={floorIndex}
                  flatIndex={flatIndex}
                  areaIndex={areaIndex}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default AreaAccordionCompo;
