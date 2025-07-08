// import './App.css'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";
import DashboardCompo from "./app/components/DashboardCompo";
import FilterCompo from "./app/components/FilterCompo";
import TabCompo from "./app/components/TabCompo";
import { setTab } from "./app/features/tabSlice";
import { useDeviceListener } from "./app/hooks/useDeviceListener";
import type { AreaItem, FlatItem, FloorItem } from "./app/model/AccordionItem";
import type { DashBoardItem } from "./app/model/DashBoardItem";
import type { FormChangeItem } from "./app/model/FormChangeItem";
import type { LineItem } from "./app/model/LineItem";
import type { AppDispatch, RootState } from "./app/store";
import { Button } from "./components/ui/button";
import type { FilterItem } from "./app/model/FilterItem";

function App() {
  // sets devicetype according to screen width
  useDeviceListener();

  // redux dispatch
  let dispatch = useDispatch<AppDispatch>();
  const currentTab = useSelector((state: RootState) => state.tab.currentTab);

  const mainRecord = useRef<any>({});
  const initialMainRecord = useRef<any>({});
  const initialFilter = useRef<FilterItem>({
    lineItemFilter: {
      value: "none",
      choice: [{ label: "All Line Item", value: "none" }],
    },
    statusFilter: {
      value: "none",
      choice: [
        { label: "All Statuses", value: "none" },
        { label: "Pending", value: "PENDING" },
        { label: "Completed", value: "COMPLETED" },
        { label: "In Progress", value: "IN_PROGRESS" },
      ],
    },
    quickAction: {
      value: "none",
      choice: [
        { label: "Chose Action", value: "none" },
        { label: "Expand All Section", value: "expand" },
        { label: "Collapse All Section", value: "collapse" },
        { label: "Reset Filter", value: "reset" },
      ],
    },
  });

  const [tabRecord, setTabRecord] = useState<any>({});
  const [dbRecord, setDbRecord] = useState<DashBoardItem>({
    lastUpdated: "",
    overallProgress: 0,
    projectName: "",
    workOrder: "",
  }); // dashboard record as
  const [filter, setFilter] = useState<FilterItem>(
    structuredClone(initialFilter.current)
  );

  // const currentTab = useRef("typical");

  const injectIndexesToTabRecord = (record: typeof tabRecord) => {
    if (currentTab === "typical") {
      return {
        ...record,
        floors:
          record.floors?.map((floor: FloorItem, floorIndex: number) => ({
            ...floor,
            floorIndex,
            flats:
              floor.flats?.map((flat, flateIndex) => ({
                ...flat,
                flateIndex,
                areas:
                  flat.areas?.map((area, areaIndex) => ({
                    ...area,
                    areaIndex,
                    lineItems:
                      area.lineItems?.map((li, lineIndex) => ({
                        ...li,
                        lineIndex,
                      })) ?? [],
                  })) ?? [],
              })) ?? [],
          })) ?? [],
      };
    } else {
      return {
        ...record,
        areas:
          record.areas?.map((area: AreaItem, areaIndex: number) => ({
            ...area,
            areaIndex,
            lineItems:
              area.lineItems?.map((li, lineIndex) => ({
                ...li,
                lineIndex,
                areaIndex,
              })) ?? [],
          })) ?? [],
      };
    }
  };

  const searchTabRecord = useMemo(() => {
    let lineItem: string = filter.lineItemFilter.value;
    let status: string = filter.statusFilter.value;
    let lineFilter: boolean = true;
    let statusFilter: boolean = true;
    if (lineItem === "none") lineFilter = false;

    if (status === "none") statusFilter = false;

    if (!lineFilter && !statusFilter) {
      return injectIndexesToTabRecord(tabRecord);
    }

    if (currentTab === "typical") {
      return {
        ...tabRecord,
        floors: tabRecord.floors
          ?.map((floor: FloorItem, floorIndex: number) => ({
            ...floor,
            floorIndex, // ✅ preserve floor index
            flats: floor.flats
              .map((flat, flateIndex) => ({
                ...flat,
                flateIndex, // ✅ preserve flat index
                areas: flat.areas
                  .map((area, areaIndex) => ({
                    ...area,
                    areaIndex,
                    lineItems: area.lineItems
                      .map((li, lineIndex) => ({ ...li, lineIndex }))
                      .filter((li) =>
                        li.name.toLowerCase().includes(lineItem.toLowerCase())
                      ),
                  }))
                  .filter((a) => a.lineItems.length > 0),
              }))
              .filter((f) => f.areas.length > 0),
          }))
          .filter((f: any) => f.flats.length > 0),
      };
    } else {
      return {
        ...tabRecord,
        areas: tabRecord.areas
          ?.map((area: AreaItem, areaIndex: number) => ({
            ...area,
            areaIndex,
            lineItems: area.lineItems
              .map((li, lineIndex) => ({ ...li, lineIndex }))
              .filter((li) =>
                li.name.toLowerCase().includes(lineItem.toLowerCase())
              ),
          }))
          .filter((a: any) => a.lineItems.length > 0),
      };
    }
  }, [filter, tabRecord, currentTab]);

  const getInitial = () => {
    dispatch(setTab("typical"));
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
        overallProgress: 0,
        lastUpdated: "2025-01-03T14:45:00Z",
        totalLineItems: 10,
        completedLineItems: 0,
        pendingLineItems: 10,
        inProgressLineItems: 0,
      },
      areas: {
        typical: {
          name: "Typical Areas",
          description: "Standard residential unit areas",
          progress: 0,
          floors: [
            {
              id: "floor1",
              name: "Floor 1",
              progress: 0,
              isCompleted: false,
              collapse: true,
              flats: [
                {
                  id: "flat101",
                  name: "Flat 101",
                  progress: 0,
                  isCompleted: false,
                  collapse: false,
                  areas: [
                    {
                      id: "commontoilet101",
                      name: "Common Toilet",
                      progress: 0,
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
                          status: "PENDING",
                          isCompleted: false,
                          remarks: "",
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
                      progress: 0,
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
                          isCompleted: false,
                          remarks: "",
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
        with_qty: {
          name: "With Qty",
          description: "Standard residential unit areas",
          progress: 0,
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
        without_qty: {
          name: "Without Qty",
          description: "Standard residential unit areas",
          progress: 0,
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
                  addQuantity: {
                    value: 0,
                    unit: "sqft",
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
                  addQuantity: {
                    value: 0,
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
      },
    };

    // setting dashboard
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

    initialMainRecord.current = structuredClone(initialValue);
    mainRecord.current = initialValue;

    // setting filter
    let listItems: LineItem[] = getLineItems();
    let filt: FilterItem = filter;
    for (let i = 0; i < listItems.length; i++) {
      const name = listItems[i].name;
      let obj = { label: name, value: name };
      filt.lineItemFilter.choice.push(obj);
    }
    setFilter({ ...filt });
    setTabRecord({ ...initialValue.areas.typical });
  };

  const getLineItems = (): LineItem[] => {
    switch (currentTab) {
      case "typical":
        return (
          mainRecord.current.areas.typical?.floors?.flatMap(
            (floor: FloorItem) =>
              floor.flats.flatMap((flat) =>
                flat.areas.flatMap((area) => area.lineItems || [])
              )
          ) || []
        );
      case "with_qty":
        return (
          mainRecord.current.areas.with_qty?.areas?.flatMap(
            (area: AreaItem) => area.lineItems || []
          ) || []
        );
      case "without_qty":
        return (
          mainRecord.current.areas.without_qty?.areas?.flatMap(
            (area: AreaItem) => area.lineItems || []
          ) || []
        );
      default:
        return (
          mainRecord.current.areas.typical?.floors?.flatMap(
            (floor: FloorItem) =>
              floor.flats.flatMap((flat) =>
                flat.areas.flatMap((area) => area.lineItems || [])
              )
          ) || []
        );
    }
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
    return newFormat;
  };

  const tabChangeFn = (val: string) => {
    switch (val) {
      case "typical":
        // updateAllProgress();
        dispatch(setTab("typical"));
        setTabRecord({ ...mainRecord.current.areas.typical });
        break;
      case "with_qty":
        // updateAllProgress();
        dispatch(setTab("with_qty"));
        setTabRecord({ ...mainRecord.current.areas.with_qty });
        break;
      case "without_qty":
        // updateAllProgress();
        dispatch(setTab("without_qty"));
        setTabRecord({ ...mainRecord.current.areas.without_qty });
        break;

      default:
        dispatch(setTab("typical"));
        setTabRecord({ ...mainRecord.current.areas.typical });
        break;
    }
  };

  // val: string|boolean|number,
  // area: "FLOOR" | "FLAT" | "AREA",
  // isCheckChange: boolean,
  // isCollapseChange: boolean,
  // floorIndex?: number,
  // flateIndex?: number,
  // areaIndex?: number

  const formChange = useCallback(
    (obj: FormChangeItem) => {
      console.log(obj);

      let updatedRecord = structuredClone(tabRecord);
      if (currentTab === "typical") {
        if (obj.area === "FLOOR" && obj.floorIndex !== undefined) {
          updatedRecord.floors[obj.floorIndex][obj.field] = obj.value;
          console.log("updatedRecord", updatedRecord);
        } else if (
          obj.area === "FLAT" &&
          obj.floorIndex !== undefined &&
          obj.flateIndex !== undefined
        ) {
          updatedRecord.floors[obj.floorIndex].flats[obj.flateIndex][
            obj.field
          ] = obj.value;
        } else if (
          obj.area === "AREA" &&
          obj.floorIndex !== undefined &&
          obj.flateIndex !== undefined &&
          obj.areaIndex !== undefined
        ) {
          updatedRecord.floors[obj.floorIndex].flats[obj.flateIndex].areas[
            obj.areaIndex
          ][obj.field] = obj.value;
        } else if (
          obj.area === "LINE" &&
          obj.floorIndex !== undefined &&
          obj.flateIndex !== undefined &&
          obj.areaIndex !== undefined &&
          obj.lineIndex !== undefined
        ) {
          updatedRecord.floors[obj.floorIndex].flats[obj.flateIndex].areas[
            obj.areaIndex
          ].lineItems[obj.lineIndex][obj.field] = obj.value;
        }
      } else {
        if (obj.area === "AREA" && obj.areaIndex !== undefined) {
          updatedRecord.areas[obj.areaIndex][obj.field] = obj.value;
        } else if (
          obj.area === "LINE" &&
          obj.areaIndex !== undefined &&
          obj.lineIndex !== undefined
        ) {
          updatedRecord.areas[obj.areaIndex].lineItems[obj.lineIndex][
            obj.field
          ] = obj.value;
        }
      }
      let message: string = "";
      if (obj.isCheckChange) {
        setAllNestedCheck(obj, updatedRecord);
        message += obj.area;
        if (typeof obj.value === "boolean") {
          if (obj.value) {
            message += " Marked!";
          } else {
            message += " UnMarked!";
          }
          toast.info(message, { position: "top-right" });
        }
      }

      updateMainRecord(updatedRecord);
      setTabRecord(updatedRecord);
    },
    [tabRecord]
  );

  const updateMainRecord = (record: typeof tabRecord) => {
    switch (currentTab) {
      case "typical":
        mainRecord.current.areas.typical = record;
        break;
      case "with_qty":
        mainRecord.current.areas.with_qty = record;
        break;
      case "without_qty":
        mainRecord.current.areas.without_qty = record;
        break;

      default:
        break;
    }
    updateAllProgress();
  };

  const setAllNestedCheck = (obj: FormChangeItem, record: typeof tabRecord) => {
    const { floorIndex, flateIndex, areaIndex, lineIndex, area, value } = obj;
    if (typeof value !== "boolean") {
      return;
    }
    const newStatus: boolean = value ?? false;
    // Step 1: Line-based progress calculation helpers

    const getLineStatsFromArea = (area: AreaItem) => {
      let total = 0;
      let completed = 0;

      // areas.forEach((area: AreaItem) => {
      if (area.lineItems.length > 0) {
        area.lineItems.forEach((line: LineItem) => {
          total++;
          if (line.isCompleted) completed++;
        });
      } else {
        total++;
        if (area.isCompleted) completed++;
      }
      // });

      return { total, completed };
    };

    const updateAreaProgress = (area: AreaItem) => {
      const { total, completed } = getLineStatsFromArea(area);
      area.progress = total === 0 ? 0 : Math.round((completed / total) * 100);
      area.isCompleted = area.progress === 100;
      return { total, completed };
    };

    // const updateFlatProgress = (flat: FlatItem) => {

    //   const { total, completed } = getLineStatsFromAreas(flat.areas);
    //   flat.progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    //   flat.isCompleted = flat.progress === 100;
    // };

    const updateFlatProgress = (flat: FlatItem) => {
      let total = 0;
      let completed = 0;
      flat.areas.forEach((area: AreaItem) => {
        const { total: ft, completed: fc } = updateAreaProgress(area);
        total += ft;
        completed += fc;
      });
      flat.progress = total === 0 ? 0 : Math.round((completed / total) * 100);
      flat.isCompleted = flat.progress === 100;
      return { total, completed };
    };

    const updateFloorProgress = (floor: FloorItem) => {
      let total = 0;
      let completed = 0;

      floor.flats.forEach((flat: FlatItem) => {
        const { total: ft, completed: fc } = updateFlatProgress(flat);
        total += ft;
        completed += fc;
      });

      floor.progress = total === 0 ? 0 : Math.round((completed / total) * 100);
      floor.isCompleted = floor.progress === 100;
    };

    // Step 2: Recursive isCompleted & progress update by area

    if (area === "FLOOR" && floorIndex != null) {
      const floor = record.floors[floorIndex];
      floor.isCompleted = newStatus;

      floor.flats.forEach((flat: FlatItem) => {
        flat.isCompleted = newStatus;
        flat.areas.forEach((area: AreaItem) => {
          area.isCompleted = newStatus;
          area.lineItems.forEach((line: LineItem) => {
            line.isCompleted = newStatus;
            line.status = newStatus ? "COMPLETED" : "PENDING";
            line.completedDate = newStatus ? new Date().toISOString() : "";
          });
        });
      });

      updateFloorProgress(floor);
    } else if (area === "FLAT" && floorIndex != null && flateIndex != null) {
      const flat = record.floors[floorIndex].flats[flateIndex];
      flat.isCompleted = newStatus;

      flat.areas.forEach((area: AreaItem) => {
        area.isCompleted = newStatus;
        area.lineItems.forEach((line: LineItem) => {
          line.isCompleted = newStatus;
          line.status = newStatus ? "COMPLETED" : "PENDING";
          line.completedDate = newStatus ? new Date().toISOString() : "";
        });
      });

      // updateFlatProgress(flat);
      updateFloorProgress(record.floors[floorIndex]);
    } else if (area === "AREA" && areaIndex != null) {
      if (floorIndex != null && flateIndex != null) {
        // for typical
        const areaItem =
          record.floors[floorIndex].flats[flateIndex].areas[areaIndex];
        // areaItem.isCompleted = newStatus;

        areaItem.lineItems.forEach((line: LineItem) => {
          line.isCompleted = newStatus;
          line.status = newStatus ? "COMPLETED" : "PENDING";
          line.completedDate = newStatus ? new Date().toISOString() : "";
        });

        // updateFlatProgress(record.floors[floorIndex].flats[flateIndex]);
        updateFloorProgress(record.floors[floorIndex]);
      } else {
        // for with_qty and without_qty
        const areaItem = record.areas[areaIndex];
        // areaItem.isCompleted = newStatus;

        areaItem.lineItems.forEach((line: LineItem) => {
          line.isCompleted = newStatus;
          line.status = newStatus ? "COMPLETED" : "PENDING";
          line.completedDate = newStatus ? new Date().toISOString() : "";
        });
        updateAreaProgress(areaItem);
      }
    } else if (area === "LINE" && areaIndex != null && lineIndex != null) {
      if (floorIndex != null && flateIndex != null) {
        // for typical
        const areaItem =
          record.floors[floorIndex].flats[flateIndex].areas[areaIndex];
        const line = areaItem.lineItems[lineIndex];
        line.isCompleted = newStatus;
        line.status = newStatus ? "COMPLETED" : "PENDING";
        line.completedDate = newStatus ? new Date().toISOString() : "";

        // const total = areaItem.lineItems.length;
        // const completed = areaItem.lineItems.filter(
        //   (l: LineItem) => l.isCompleted
        // ).length;

        // areaItem.progress =
        //   total === 0 ? 0 : Math.round((completed / total) * 100);
        // areaItem.isCompleted = areaItem.progress === 100;

        // updateFlatProgress(record.floors[floorIndex].flats[flateIndex]);
        updateFloorProgress(record.floors[floorIndex]);
      } else {
        // for with_qty and without_qty
        const areaItem = record.areas[areaIndex];
        const line = areaItem.lineItems[lineIndex];
        line.isCompleted = newStatus;
        line.status = newStatus ? "COMPLETED" : "PENDING";
        line.completedDate = newStatus ? new Date().toISOString() : "";

        // const total = areaItem.lineItems.length;
        // const completed = areaItem.lineItems.filter(
        //   (l: LineItem) => l.isCompleted
        // ).length;

        // areaItem.progress =
        //   total === 0 ? 0 : Math.round((completed / total) * 100);
        // areaItem.isCompleted = areaItem.progress === 100;
        updateAreaProgress(areaItem);
      }
    }
  };

  const updateAllProgress = () => {
    let totalLineItems = 0;
    let completedLineItems = 0;
    let inProgressLineItems = 0;

    // Handle tab types: typical, with_qty, without_qty
    const updateAreaProgress = (area: AreaItem) => {
      const total = area.lineItems.length;
      const completed = area.lineItems.filter((li) => li.isCompleted).length;

      // area.progress = total === 0 ? 0 : Math.round((completed / total) * 100);
      // area.isCompleted = area.progress === 100;

      totalLineItems += total;
      completedLineItems += completed;
      inProgressLineItems += area.lineItems.filter(
        (li) => li.status === "IN_PROGRESS"
      ).length;
    };

    const updateFlatProgress = (flat: FlatItem) => {
      flat.areas.forEach(updateAreaProgress);

      // const total = flat.areas.reduce(
      //   (sum, area) => sum + area.lineItems.length || 1,
      //   0
      // );
      // const completed = flat.areas.reduce((sum, area) => {
      //   return (
      //     sum +
      //     (area.lineItems.length > 0
      //       ? area.lineItems.filter((li) => li.isCompleted).length
      //       : area.isCompleted
      //       ? 1
      //       : 0)
      //   );
      // }, 0);

      // flat.progress = total === 0 ? 0 : Math.round((completed / total) * 100);
      // flat.isCompleted = flat.progress === 100;
    };

    const updateFloorProgress = (floor: FloorItem) => {
      floor.flats.forEach(updateFlatProgress);

      // const total = floor.flats.reduce(
      //   (sum, flat) =>
      //     sum +
      //     flat.areas.reduce(
      //       (aSum, area) => aSum + area.lineItems.length || 1,
      //       0
      //     ),
      //   0
      // );
      // const completed = floor.flats.reduce((sum, flat) => {
      //   return (
      //     sum +
      //     flat.areas.reduce((aSum, area) => {
      //       return (
      //         aSum +
      //         (area.lineItems.length > 0
      //           ? area.lineItems.filter((li) => li.isCompleted).length
      //           : area.isCompleted
      //           ? 1
      //           : 0)
      //       );
      //     }, 0)
      //   );
      // }, 0);

      // floor.progress =
      //   total === 0 ? 0 : Math.round((completed / total) * 100);
      // floor.isCompleted = floor.progress === 100;
    };

    //  1. Update `typical`
    if (mainRecord.current.areas?.typical?.floors) {
      mainRecord.current.areas.typical.floors.forEach(updateFloorProgress);
      const typicalFloors = mainRecord.current.areas.typical.floors;
      const totalLines = typicalFloors.reduce(
        (sum: number, floor: FloorItem) => {
          return (
            sum +
            floor.flats.reduce((flatSum: number, flat: FlatItem) => {
              return (
                flatSum +
                flat.areas.reduce(
                  (areaSum: number, area: AreaItem) =>
                    areaSum + area.lineItems.length,
                  0
                )
              );
            }, 0)
          );
        },
        0
      );

      const completedLines = typicalFloors.reduce(
        (sum: number, floor: FloorItem) => {
          return (
            sum +
            floor.flats.reduce((flatSum: number, flat: FlatItem) => {
              return (
                flatSum +
                flat.areas.reduce(
                  (areaSum: number, area: AreaItem) =>
                    areaSum +
                    area.lineItems.filter((li) => li.isCompleted).length,
                  0
                )
              );
            }, 0)
          );
        },
        0
      );

      mainRecord.current.areas.typical.progress =
        totalLines === 0 ? 0 : Math.round((completedLines / totalLines) * 100);
    }

    //  2. Update `with_qty`
    if (mainRecord.current.areas?.with_qty?.areas) {
      mainRecord.current.areas.with_qty.areas.forEach(updateAreaProgress);
      const all = mainRecord.current.areas.with_qty.areas;
      const total = all.reduce(
        (sum: number, area: AreaItem) => sum + area.lineItems.length,
        0
      );
      const completed = all.reduce(
        (sum: number, area: AreaItem) =>
          sum + area.lineItems.filter((li) => li.isCompleted).length,
        0
      );
      mainRecord.current.areas.with_qty.progress =
        total === 0 ? 0 : Math.round((completed / total) * 100);
    }

    //  3. Update `without_qty`
    if (mainRecord.current.areas?.without_qty?.areas) {
      mainRecord.current.areas.without_qty.areas.forEach(updateAreaProgress);
      const all = mainRecord.current.areas.without_qty.areas;
      const total = all.reduce(
        (sum: number, area: AreaItem) => sum + area.lineItems.length,
        0
      );
      const completed = all.reduce(
        (sum: number, area: AreaItem) =>
          sum + area.lineItems.filter((li) => li.isCompleted).length,
        0
      );
      mainRecord.current.areas.without_qty.progress =
        total === 0 ? 0 : Math.round((completed / total) * 100);
    }

    // 4. Update global project summary
    const overallProgress =
      totalLineItems === 0
        ? 0
        : Math.round((completedLineItems / totalLineItems) * 100);
    mainRecord.current.progressSummary = {
      overallProgress,
      lastUpdated: new Date().toISOString(),
      totalLineItems,
      completedLineItems,
      inProgressLineItems,
      pendingLineItems:
        totalLineItems - completedLineItems - inProgressLineItems,
    };
    // 4. Update DashBoard
    let db: DashBoardItem = {
      ...dbRecord,
      overallProgress,
      lastUpdated: formatDateTime(new Date().toISOString()),
    };
    setDbRecord({ ...db });
  };

  // type[line(lineItemFilter),status(statusFilter),quick(quickAction)]
  const filterChange = (value: string, type: string): void => {
    if (type === "line") {
      let filt = filter;
      filt.lineItemFilter.value = value;
      setFilter({ ...filt });
    }

    if (type === "quick") {
      switch (value) {
        case "reset":
          setFilter(structuredClone(initialFilter.current));
          break;
        case "expand":
          break;
        case "collapse":
          break;

        default:
          break;
      }
    }
  };

  const resetTab = () => {
    mainRecord.current = structuredClone(initialMainRecord.current);
    dispatch(setTab("typical"));
    setTabRecord({ ...mainRecord.current.areas.typical });
    toast.info("Tab Reset", { position: "top-right" });
  };

  const saveProgress = () => {
    let postBody = {
      typical: mainRecord.current?.areas?.typical,
      with_qty: mainRecord.current?.areas?.with_qty,
      without_qty: mainRecord.current?.areas?.without_qty,
    };
    console.log(postBody);
    toast.success("Saved Progress", { position: "top-right" });
    // POST API Call With postBody
  };

  useEffect(() => {
    getInitial();
  }, []);

  return (
    <div className="flex flex-col w-screen bg-muted">
      <Toaster richColors />
      <div className="flex justify-center align-middle">
        <DashboardCompo dashboradItem={dbRecord} />
      </div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className=" w-full  md:w-[30%]   flex  justify-center ">
          <FilterCompo filterItem={filter} filterChange={filterChange} />
        </div>
        <div className="w-full md:w-[70%] md:h-full flex flex-col items-center justify-center p-4">
          <TabCompo
            tabChangeFn={tabChangeFn}
            formChange={formChange}
            tabRecod={searchTabRecord}
          />
          <div className="flex flex-row w-full justify-start align-baseline">
            <Button
              variant={"default"}
              className="me-2"
              onClick={() => {
                saveProgress();
              }}
            >
              Save Progress
            </Button>
            <Button
              variant={"outline"}
              className="mx-2"
              onClick={() => {
                resetTab();
              }}
            >
              Reset Tabs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
