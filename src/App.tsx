// import './App.css'

import { useDispatch, useSelector } from "react-redux";
import { useDeviceListener } from "./app/hooks/useDeviceListener";
import type { AppDispatch, RootState } from "./app/store";
import TabCompo from "./app/components/TabCompo";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardTitle } from "./components/ui/card";
import FilterCompo from "./app/components/FilterCompo";
import DashboardCompo from "./app/components/DashboardCompo";
import type { DashBoardItem } from "./app/model/DashBoardItem";
import type { FormChangeItem } from "./app/model/FormChangeItem";

function App() {
  // sets devicetype according to screen width
  useDeviceListener();

  // redux dispatch
  let dispatch = useDispatch<AppDispatch>();

  const [tabRecord, setTabRecord] = useState<any>({});
  const [dbRecord, setDbRecord] = useState<DashBoardItem>({
    lastUpdated: "",
    overallProgress: 0,
    projectName: "",
    workOrder: "",
  }); // dashboard record as

  const mainRecord = useRef({});

  const getInitial = () => {
    // fetch Api to get initial value
    const initialValue = {
      project: {
        id: "proj_001",
        name: "Residential Tower A - Mumbai",
        location: "Bandra West, Mumbai, Maharashtra",
        startDate: "2024-01-15",
        expectedCompletionDate: "2025-12-31",
        status: "IN_PROGRESS",
      },
      workOrder: {
        id: "WO-002",
        title: "Interior Finishing",
        description: "Complete interior finishing work for residential units",
        startDate: "2024-06-01",
        targetDate: "2024-12-31",
        supervisor: {
          id: "sup_001",
          name: "Rajesh Kumar",
          phone: "+91-9876543210",
          email: "rajesh.kumar@construction.com",
        },
      },
      progressSummary: {
        overallProgress: 34,
        lastUpdated: "2025-01-03T14:45:00Z",
        totalLineItems: 18,
        completedLineItems: 6,
        pendingLineItems: 10,
        inProgressLineItems: 2,
      },
      areas: {
        typical: {
          name: "Typical Areas",
          description: "Standard residential unit areas",
          floors: [
            {
              id: "floor1",
              name: "Floor 1",
              progress: 25,
              isCompleted: false,
              collapse: true,
              flats: [
                {
                  id: "flat101",
                  name: "Flat 101",
                  progress: 50,
                  isCompleted: false,
                  collapse: false,
                  areas: [
                    {
                      id: "commontoilet101",
                      name: "Common Toilet",
                      progress: 50,
                      isCompleted: false,
                      collapse: false,
                      lineItems: [
                        {
                          id: "li_001",
                          name: "Tile Installation",
                          category: "tile",
                          plannedQuantity: {
                            value: 25,
                            unit: "sqft",
                          },
                          status: "COMPLETED",
                          isCompleted: true,
                          remarks: "Quality approved",
                          completedDate: "2025-01-02T10:30:00Z",
                          assignedTo: "Tile Team A",
                        },
                        {
                          id: "li_002",
                          name: "Plumbing Fixtures",
                          category: "plumbing",
                          plannedQuantity: {
                            value: 3,
                            unit: "units",
                          },
                          status: "PENDING",
                          isCompleted: false,
                          collapse: false,
                          remarks: "",
                          estimatedStartDate: "2025-01-05T09:00:00Z",
                          assignedTo: "Plumbing Team B",
                        },
                      ],
                    },
                    {
                      id: "mastertoilet101",
                      name: "Master Toilet",
                      progress: 50,
                      isCompleted: false,
                      collapse: false,
                      lineItems: [
                        {
                          id: "li_003",
                          name: "Tile Installation",
                          category: "tile",
                          plannedQuantity: {
                            value: 30,
                            unit: "sqft",
                          },
                          status: "IN_PROGRESS",
                          isCompleted: true,
                          remarks: "75% complete",
                          startedDate: "2024-12-30T08:00:00Z",
                          assignedTo: "Tile Team A",
                        },
                        {
                          id: "li_004",
                          name: "Electrical Fixtures",
                          category: "electrical",
                          plannedQuantity: {
                            value: 5,
                            unit: "points",
                          },
                          status: "PENDING",
                          isCompleted: false,
                          collapse: false,
                          remarks: "",
                          estimatedStartDate: "2025-01-08T09:00:00Z",
                          assignedTo: "Electrical Team C",
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "flat102",
                  name: "Flat 102",
                  progress: 0,
                  isCompleted: false,
                  collapse: false,
                  areas: [
                    {
                      id: "kitchen102",
                      name: "Kitchen",
                      progress: 0,
                      isCompleted: false,
                      collapse: false,
                      lineItems: [
                        {
                          id: "li_005",
                          name: "Cabinet Installation",
                          category: "cabinet",
                          plannedQuantity: {
                            value: 8,
                            unit: "units",
                          },
                          status: "PENDING",
                          isCompleted: false,
                          collapse: false,
                          remarks: "",
                          estimatedStartDate: "2025-01-10T09:00:00Z",
                          assignedTo: "Carpentry Team A",
                        },
                        {
                          id: "li_006",
                          name: "Countertop Installation",
                          category: "countertop",
                          plannedQuantity: {
                            value: 12,
                            unit: "sqft",
                          },
                          status: "PENDING",
                          isCompleted: false,
                          collapse: false,
                          remarks: "",
                          estimatedStartDate: "2025-01-15T09:00:00Z",
                          assignedTo: "Stone Team B",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "floor2",
              name: "Floor 2",
              progress: 0,
              isCompleted: false,
              collapse: false,
              flats: [
                {
                  id: "flat201",
                  name: "Flat 201",
                  progress: 0,
                  isCompleted: false,
                  collapse: false,
                  areas: [
                    {
                      id: "livingroom201",
                      name: "Living Room",
                      progress: 0,
                      isCompleted: false,
                      collapse: false,
                      lineItems: [
                        {
                          id: "li_007",
                          name: "Painting Work",
                          category: "painting",
                          plannedQuantity: {
                            value: 400,
                            unit: "sqft",
                          },
                          status: "PENDING",
                          isCompleted: false,
                          collapse: false,
                          remarks: "",
                          estimatedStartDate: "2025-01-20T09:00:00Z",
                          assignedTo: "Painting Team A",
                        },
                        {
                          id: "li_008",
                          name: "Flooring Work",
                          category: "flooring",
                          plannedQuantity: {
                            value: 200,
                            unit: "sqft",
                          },
                          status: "PENDING",
                          isCompleted: false,
                          collapse: false,
                          remarks: "",
                          estimatedStartDate: "2025-01-25T09:00:00Z",
                          assignedTo: "Flooring Team B",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };
    let workOrder: string =
      initialValue.workOrder.id + "-" + initialValue.workOrder.title;
    let formattedDate = formatDateTime(
      initialValue.progressSummary.lastUpdated
    );
    let dbObj: DashBoardItem = {
      projectName: initialValue.project.name,
      workOrder: workOrder,
      overallProgress: initialValue.progressSummary.overallProgress,
      lastUpdated: formattedDate,
    };
    setDbRecord(dbObj);
    mainRecord.current = initialValue;
    console.log(initialValue.areas.typical);

    setTabRecord({ ...initialValue.areas.typical });
  };

  const formatDateTime = (input: string): string => {
    const date = new Date(input);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    let newFormat: string = date.toLocaleString("en-US", options);
    console.log(newFormat);
    return newFormat;
  };

  // val: string|boolean|number,
  // area: "FLOOR" | "FLAT" | "AREA",
  // isCheckChange: boolean,
  // isCollapseChange: boolean,
  // floorIndex?: number,
  // flateIndex?: number,
  // areaIndex?: number

  const formChange = useCallback((obj: FormChangeItem) => {
    let updatedRecord  = structuredClone(tabRecord);;
    if (obj.isCheckChange) {
    }

    setTabRecord(updatedRecord );
  }, [tabRecord]);

  useEffect(() => {
    getInitial();
  }, []);

  // const deviceType = useSelector((state: RootState) => state.device.type); // can be Mobile , Tablet or Desktop

  {
    console.log(tabRecord);
  }
  return (
    <div className="flex flex-col w-screen bg-muted">
      <div className="flex justify-center align-middle">
        <DashboardCompo dashboradItem={dbRecord} />
      </div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className=" w-full  md:w-[30%]   flex  justify-center ">
          <FilterCompo />
        </div>
        <div className="w-full md:w-[70%] md:h-full flex flex-col items-center justify-center p-4">
          {/* <h1>You're using: {deviceType}</h1> */}
          <TabCompo formChange={formChange} tabRecod={tabRecord} />
        </div>
      </div>
    </div>
  );
}

export default App;
