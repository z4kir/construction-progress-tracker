import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import type { FormChangeItem } from "../model/FormChangeItem";
import type { RootState } from "../store";
import AccordionCompo from "./AccordionCompo";
import AreaAccordionCompo from "./AreaAccordionCompo";

type Props = {
  tabRecod: any;
  formChange: (obj: FormChangeItem) => void;
  tabChangeFn: (val: string) => void;
};

const TabCompo = ({ tabRecod, formChange, tabChangeFn }: Props) => {
  const currentTab = useSelector((state: RootState) => state.tab.currentTab);
  return (
    <div className="flex w-full  flex-col ">
      <Tabs
        value={currentTab}
        onValueChange={(val) => {
          tabChangeFn(val);
        }}
      >
        <div className=" w-full whitespace-nowrap overflow-x-auto mobile-scrollbar">
          <TabsList className="bg-[#e9e8e8] w-auto">
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
        </TabsContent>
        <TabsContent value="with_qty">
          <AreaAccordionCompo formChange={formChange} areas={tabRecod?.areas} />
        </TabsContent>
        <TabsContent value="without_qty">
          <AreaAccordionCompo formChange={formChange} areas={tabRecod?.areas} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabCompo;
