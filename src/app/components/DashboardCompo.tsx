import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashBoardItem } from "../model/DashBoardItem";

type Props = {dashboradItem:DashBoardItem};

const DashboardCompo = ({dashboradItem}: Props) => {
  return (
    <div className="min-h-[85vh] px-4 pt-8  grid place-items-center bg-[#d5d4d4]">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Construction Progress Tracker
          </h1>
          <p className="text-sm md:text-base  mt-2">
            Real-time work progress monitoring and updates
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card className="bg-white/10  ">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide /70 mb-1">
                Current Project
              </p>
              <p className="text-lg font-semibold">
                {dashboradItem.projectName}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10  ">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide /70 mb-1">
                Work Order
              </p>
              <p className="text-lg font-semibold">
                {dashboradItem.workOrder}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10  ">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide /70 mb-1">
                Overall Progress
              </p>
              <p className="text-2xl font-bold">  {dashboradItem.overallProgress}%</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10   sm:col-span-2 md:col-span-1">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide /70 mb-1">
                Last Updated
              </p>
              <p className="text-lg font-semibold">{dashboradItem.lastUpdated}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    // <Card className="m-3 w-full">
    //    <CardHeader>
    //     <CardTitle>Dashboard</CardTitle>
    //   </CardHeader>
    // </Card>
  );
};

export default DashboardCompo;
