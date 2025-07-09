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
  return (
    <div>
      {floorList?.map((floor, floorIndex) => (
        <Accordion
          className="my-2"
          key={floorIndex}
          type="single"
          value={floor.collapse ? floor.id : ""}
          onValueChange={(value) => {
            let val: boolean;
            if (value === "") {
              val = false;
            } else {
              val = true;
            }
            let changeObj: FormChangeItem = {
              value: val,
              field: "collapse",
              area: "FLOOR",
              floorIndex: floor.floorIndex,
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
                          field: "isCompleted",
                          area: "FLOOR",
                          isCheckChange: true,
                          floorIndex: floor.floorIndex,
                        };
                        formChange(changeObj);
                      }}
                    />
                    <label className="text-sm font-medium hover:cursor-pointer">
                      Mark {floor.name} Completed
                    </label>
                  </div>

                  <h3 className="text-lg font-bold">{floor.name}</h3>

                  <div className="flex items-center gap-2">
                    <Progress value={floor.progress} className="w-40 h-2" />
                    <span className="text-sm">{floor.progress}%</span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="mt-4 px-2 text-sm  overflow-auto">
              <div>
                {floor?.flats?.map((flat, flatIndex) => (
                  <Accordion
                    className="my-2"
                    type="single"
                    key={flatIndex}
                    value={flat.collapse ? flat.id : ""}
                    onValueChange={(value) => {
                      let val: boolean;
                      if (value === "") {
                        val = false;
                      } else {
                        val = true;
                      }
                      let changeObj: FormChangeItem = {
                        value: val,
                        field: "collapse",
                        floorIndex: floor.floorIndex,
                        flateIndex: flat.flateIndex,
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
                                    field: "isCompleted",
                                    area: "FLAT",
                                    isCheckChange: true,
                                    floorIndex: floor.floorIndex,
                                    flateIndex: flat.flateIndex,
                                  };
                                  formChange(changeObj);
                                }}
                              />
                              <label className="text-sm font-medium hover:cursor-pointer">
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
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="mt-4 px-2 text-sm  overflow-auto">
                        <AreaAccordionCompo
                          formChange={formChange}
                          areas={flat.areas}
                          floorIndex={floor.floorIndex}
                          flatIndex={flat.flateIndex}
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
