import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccordionCompo from "./AccordionCompo";
import AreaAccordionCompo from "./AreaAccordionCompo";
import { useEffect } from "react";
import type { FormChangeItem } from "../model/FormChangeItem";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

type Props = {
  tabRecod: any;
  formChange: (obj: FormChangeItem) => void;
  tabChangeFn: (val: string) => void;
  // currentTab: string;
};

const TabCompo = ({ tabRecod, formChange, tabChangeFn }: Props) => {
  const currentTab = useSelector((state: RootState) => state.tab.currentTab);

  console.log("tabRecod passed to AccordionCompo:", tabRecod, currentTab);
  console.log("tabRecod.floor:", tabRecod?.floors);
  return (
    <div className="flex w-full  flex-col ">
      <Tabs
        value={currentTab}
        onValueChange={(val) => {
          tabChangeFn(val);
        }}
      >
        <div className=" w-full whitespace-nowrap overflow-x-auto mobile-scrollbar">
          <TabsList className="bg-[#e9e8e8]">
            <TabsTrigger value="typical">Typical Areas</TabsTrigger>
            <TabsTrigger value="with_qty">Other Areas (with Qty)</TabsTrigger>
            <TabsTrigger value="without_qty">
              Other Areas (without Qty)
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="typical">
          <AccordionCompo
            formChange={formChange}
            floorList={tabRecod?.floors}
          />
          {/* <AccordionCompo
            id="rooftop"
            label="Mark Rooftop Complete"
            title="Rooftop - General Area"
            progress={75}
            checked={false}
            onCheckChange={(val) => console.log("Checked:", val)}
          /> */}
        </TabsContent>
        <TabsContent value="with_qty">
          <AreaAccordionCompo formChange={formChange} areas={tabRecod?.areas} />
          {/* <AreaAccordionCompo
            id="rooftop"
            label="Mark Rooftop Complete"
            title="Rooftop - General Area"
            progress={75}
            checked={false}
            onCheckChange={(val) => console.log("Checked:", val)}
          /> */}
        </TabsContent>
        <TabsContent value="without_qty">
          <AreaAccordionCompo formChange={formChange} areas={tabRecod?.areas} />
          {/* <AreaAccordionCompo
            id="rooftop"
            label="Mark Rooftop Complete"
            title="Rooftop - General Area"
            progress={75}
            checked={false}
            onCheckChange={(val) => console.log("Checked:", val)}
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabCompo;
