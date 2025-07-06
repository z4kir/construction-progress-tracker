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

type Props = {
  tabRecod: any;
  formChange: (obj: FormChangeItem) => void;
};

const TabCompo = ({ tabRecod, formChange }: Props) => {
  // useEffect(() => {
  //   console.log(JSON.stringify(tabRecod));
  // }, [tabRecod]);
  console.log("tabRecod passed to AccordionCompo:", tabRecod);
  console.log("tabRecod.floor:", tabRecod?.floors);
  return (
    <div className="flex w-full  flex-col ">
      <Tabs defaultValue="typical_areas">
        <div className=" w-full whitespace-nowrap overflow-x-auto mobile-scrollbar">
          <TabsList className="bg-[#e9e8e8]">
            <TabsTrigger value="typical_areas">Typical Areas</TabsTrigger>
            <TabsTrigger value="with_qty">Other Areas (with Qty)</TabsTrigger>
            <TabsTrigger value="without_qty">
              Other Areas (without Qty)
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="typical_areas">
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
