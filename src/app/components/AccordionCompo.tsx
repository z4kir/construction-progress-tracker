import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import type { FloorItem } from "../model/AccordionItem";
import AreaAccordionCompo from "./AreaAccordionCompo";
import type { FormChangeItem } from "../model/FormChangeItem";
type Props = {
  floorList: FloorItem[];
  formChange: (obj: FormChangeItem) => void;
};

const AccordionCompo = ({ floorList, formChange }: Props) => {
  console.log("floorList", floorList);
  return (
    <div>
      {floorList?.map((floor, floorIndex) => (
        <Accordion
          className="my-2"
          key={floorIndex}
          type="single"
          value={floor.collapse ? floor.id : ""}
          onValueChange={(val) => {
            if (val === "") {
              floor.collapse = false;
            } else {
              floor.collapse = true;
            }
            let changeObj: FormChangeItem = {
              area: "FLOOR",
              isCheckChange: false,
            };
            formChange(changeObj);
          }}
          collapsible
        >
          <AccordionItem
            value={floor.id}
            className="border rounded-md bg-gray-50  shadow-sm"
          >
            <AccordionTrigger className="border  bg-gray-50 px-4 py-4 shadow-sm transition-shadow hover:cursor-pointer hover:shadow-md hover:bg-muted hover:no-underline  rounded-md">
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`checkbox-${floor.id}`}
                      className="border-primary hover:border-[1.5px] hover:cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-white "
                      checked={floor.isCompleted}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onCheckedChange={(val) => {
                        let newVal: boolean = !!val;
                        floor.isCompleted = newVal;
                        let changeObj: FormChangeItem = {
                          value: newVal,
                          area: "FLOOR",
                          isCheckChange: true,
                          floorIndex: floorIndex,
                        };
                        formChange(changeObj);
                      }}
                    />
                    <label
                      // htmlFor={`checkbox-${floor.id}`}
                      className="text-sm font-medium hover:cursor-pointer"
                    >
                      Mark {floor.name} Completed
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

            <AccordionContent className="mt-4 px-2 text-sm  overflow-auto">
              {/* Expandable content here if needed */}
              <div>
                {floor?.flats?.map((flat, flatIndex) => (
                  <Accordion
                    className="my-2"
                    type="single"
                    key={flatIndex}
                    value={flat.collapse ? flat.id : ""}
                    onValueChange={(val) => {
                      if (val === "") {
                        flat.collapse = false;
                      } else {
                        flat.collapse = true;
                      }
                      let changeObj: FormChangeItem = {
                        area: "FLAT",
                        isCheckChange: false,
                      };
                      formChange(changeObj);
                    }}
                    collapsible
                  >
                    <AccordionItem
                      value={flat.id}
                      className="border rounded-md bg-gray-50 shadow-sm"
                    >
                      <AccordionTrigger className="border  bg-gray-50 px-4 py-4 shadow-sm transition-shadow hover:cursor-pointer hover:shadow-md hover:bg-muted hover:no-underline  rounded-md">
                        <div className="flex justify-between items-start w-full">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`checkbox-${flat.id}`}
                                className="border-primary hover:border-[1.5px] hover:cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-white "
                                checked={flat.isCompleted}
                                onClick={(e) => e.stopPropagation()}
                                onCheckedChange={(val) => {
                                  let newVal: boolean = !!val;
                                  flat.isCompleted = newVal;
                                  let changeObj: FormChangeItem = {
                                    value: newVal,
                                    area: "FLAT",
                                    isCheckChange: true,
                                    floorIndex: floorIndex,
                                    flateIndex: flatIndex,
                                  };
                                  formChange(changeObj);
                                }}
                              />
                              <label
                                // htmlFor={`checkbox-${flat.id}`}
                                className="text-sm font-medium hover:cursor-pointer"
                              >
                                Mark {flat.name} Completed
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
                      <AccordionContent className="mt-4 px-2 text-sm  overflow-auto">
                        {/* Expandable content here if needed */}

                        <AreaAccordionCompo
                          formChange={formChange}
                          areas={flat.areas}
                          floorIndex={floorIndex}
                          flatIndex={flatIndex}
                          // onCheckChange={(val) => console.log("Checked:", val)}
                        />
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
