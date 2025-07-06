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
import AreaAccordionCompo from "./AreaAccordionCompo";
import type { FlatItem, FloorItem } from "../model/AccordionItem";
type Props = {
  floorList: FloorItem[];
};

const AccordionCompo = ({ floorList }: Props) => {
  console.log("floorList",floorList); 
  return (
    <div>
      {floorList?.map((floor, floorIndex) => (
        <Accordion className="my-2" key={floorIndex} type="single" collapsible>
          <AccordionItem
            value={floor.id}
            className="border rounded-md bg-gray-50  shadow-sm"
          >
            <AccordionTrigger className="border  bg-gray-50 px-4 py-4 shadow-sm transition-shadow hover:shadow-md hover:bg-muted hover:no-underline  rounded-md">
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`checkbox-${floor.id}`}
                      checked={floor.isCompleted}
                      onChange={(e) => e.stopPropagation()}
                      // onCheckedChange={(val) => onCheckChange?.(!!val)}
                    />
                    <label
                      htmlFor={`checkbox-${floor.id}`}
                      className="text-sm font-medium"
                    >
                      {floor.name}
                    </label>
                  </div>

                  <h3 className="text-lg font-bold">{floor.name}</h3>

                  <div className="flex items-center gap-2">
                    <Progress value={floor.progress} className="w-40 h-2" />
                    <span className="text-sm">{floor.progress}%</span>
                  </div>
                </div>
                {/* Icon (optional) on right */}
                {/* <AccordionTrigger className="w-auto px-2" /> */}
              </div>
            </AccordionTrigger>

            <AccordionContent className="mt-4 px-2 text-sm text-muted-foreground overflow-auto">
              {/* Expandable content here if needed */}
              <div>
                {floor?.flats?.map((flat, flatIndex) => (
                  <Accordion className="my-2" type="single" key={flatIndex} collapsible>
                    <AccordionItem
                      value={flat.id}
                      className="border rounded-md bg-gray-50 shadow-sm"
                    >
                      <AccordionTrigger className="border  bg-gray-50 px-4 py-4 shadow-sm transition-shadow hover:shadow-md hover:bg-muted hover:no-underline  rounded-md">
                        <div className="flex justify-between items-start w-full">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`checkbox-${flat.id}`}
                                checked={flat.isCompleted}
                                onChange={(e) => e.stopPropagation()}
                                // onCheckedChange={(val) => {
                                //   onCheckChange?.(!!val);
                                // }}
                              />
                              <label
                                htmlFor={`checkbox-${flat.id}`}
                                className="text-sm font-medium"
                              >
                                {flat.name}
                              </label>
                            </div>

                            <h3 className="text-lg font-bold">{flat.name}</h3>

                            <div className="flex items-center gap-2">
                              <Progress
                                value={flat.progress}
                                className="w-40 h-2"
                              />
                              <span className="text-sm">{flat.progress}%</span>
                            </div>
                          </div>

                          {/* <AccordionTrigger className="w-auto px-2" /> */}
                          {/* Icon (optional) on right */}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="mt-4 px-2 text-sm text-muted-foreground overflow-auto">
                        {/* Expandable content here if needed */}
                        {flat?.areas?.map((area) => (
                          <AreaAccordionCompo
                            id={area.id}
                            label={area.name}
                            title={area.name}
                            progress={area.progress}
                            checked={area.isCompleted}
                            onCheckChange={(val) =>
                              console.log("Checked:", val)
                            }
                          />
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default AccordionCompo;
