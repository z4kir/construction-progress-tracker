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

type Props = {};

const TabCompo = ({}: Props) => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="typical_areas">
        <TabsList>
          <TabsTrigger value="typical_areas">Typical Areas</TabsTrigger>
          <TabsTrigger value="with_qty">Other Areas (with Qty)</TabsTrigger>
          <TabsTrigger value="without_qty">
            Other Areas (without Qty)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="typical_areas">
           <AccordionCompo
            id="rooftop"
            label="Mark Rooftop Complete"
            title="Rooftop - General Area"
            progress={75}
            checked={false}
            onCheckChange={(val) => console.log("Checked:", val)}
          />
        </TabsContent>
        <TabsContent value="with_qty">
          <AreaAccordionCompo
            id="rooftop"
            label="Mark Rooftop Complete"
            title="Rooftop - General Area"
            progress={75}
            checked={false}
            onCheckChange={(val) => console.log("Checked:", val)}
          />
        </TabsContent>
        <TabsContent value="without_qty">
          <AreaAccordionCompo
            id="rooftop"
            label="Mark Rooftop Complete"
            title="Rooftop - General Area"
            progress={75}
            checked={false}
            onCheckChange={(val) => console.log("Checked:", val)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabCompo;
