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

// Importing inital json from file
import initialValue from "./GET-JSON.json";
import { Label } from "./components/ui/label";

// This structure intentionally keeps nested content for UI layout
// Ignoring React.Children.only warning since <AccordionTrigger> works fine
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

  const searchTabRecord = useMemo(() => {
    const lineItem = filter.lineItemFilter.value;
    const status = filter.statusFilter.value;

    const lineFilterActive = lineItem !== "none";
    const statusFilterActive = status !== "none";

    const shouldApplyFilter = lineFilterActive || statusFilterActive;

    const filterLineItems = (lineItems: LineItem[]) => {
      return lineItems
        .map((li, lineIndex) => ({ ...li, lineIndex }))
        .filter((li) => {
          const matchesLine =
            !lineFilterActive ||
            li.name.toLowerCase().includes(lineItem.toLowerCase());
          const matchesStatus =
            !statusFilterActive ||
            li.status.toLowerCase() === status.toLowerCase();

          return matchesLine && matchesStatus;
        });
    };

    // if no filters, return original tabRecord with injected indexes
    if (!shouldApplyFilter) {
      if (currentTab === "typical") {
        return {
          ...tabRecord,
          floors: tabRecord.floors?.map(
            (floor: FloorItem, floorIndex: number) => ({
              ...floor,
              floorIndex,
              flats: floor.flats?.map((flat, flateIndex) => ({
                ...flat,
                flateIndex,
                areas: flat.areas?.map((area, areaIndex) => ({
                  ...area,
                  areaIndex,
                  lineItems: area.lineItems.map((li, lineIndex) => ({
                    ...li,
                    lineIndex,
                  })),
                })),
              })),
            })
          ),
        };
      } else {
        return {
          ...tabRecord,
          areas: tabRecord.areas?.map((area: AreaItem, areaIndex: number) => ({
            ...area,
            areaIndex,
            lineItems: area.lineItems.map((li, lineIndex) => ({
              ...li,
              lineIndex,
            })),
          })),
        };
      }
    }

    if (currentTab === "typical") {
      return {
        ...tabRecord,
        floors: tabRecord.floors
          ?.map((floor: FloorItem, floorIndex: number) => ({
            ...floor,
            floorIndex,
            flats: floor.flats
              ?.map((flat, flateIndex) => ({
                ...flat,
                flateIndex,
                areas: flat.areas
                  ?.map((area, areaIndex) => {
                    const filteredLineItems = filterLineItems(area.lineItems);
                    return {
                      ...area,
                      areaIndex,
                      lineItems: filteredLineItems,
                    };
                  })
                  .filter((area) => area.lineItems.length > 0),
              }))
              .filter((flat) => flat.areas.length > 0),
          }))
          .filter((floor: FloorItem) => floor.flats.length > 0),
      };
    } else {
      return {
        ...tabRecord,
        areas: tabRecord.areas
          ?.map((area: AreaItem, areaIndex: number) => {
            const filteredLineItems = filterLineItems(area.lineItems);
            return {
              ...area,
              areaIndex,
              lineItems: filteredLineItems,
            };
          })
          .filter((area: AreaItem) => area.lineItems.length > 0),
      };
    }
  }, [filter, tabRecord, currentTab]);

  const getInitial = () => {
    // Get API to get Initial Value

    //In this case, Getting initial value directly from the file

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
    setLineFilterChoices("typical");
    dispatch(setTab("typical"));
    setTabRecord({ ...initialValue.areas.typical });
  };

  const setLineFilterChoices = (tab: string): void => {
    let listItems: LineItem[] = getLineItems(tab);
    let filt: FilterItem = structuredClone(initialFilter.current);
    const seen = new Set<string>();

    for (let i = 0; i < listItems.length; i++) {
      const name = listItems[i].name;
      if (!seen.has(name)) {
        seen.add(name);
        let obj = { label: name, value: name };
        filt.lineItemFilter.choice.push(obj);
      }
    }
    setFilter(filt);
  };

  const getLineItems = (tab: string): LineItem[] => {
    switch (tab) {
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
        setLineFilterChoices("typical");
        setTabRecord({ ...mainRecord.current.areas.typical });
        break;
      case "with_qty":
        // updateAllProgress();
        dispatch(setTab("with_qty"));
        setLineFilterChoices("with_qty");
        setTabRecord({ ...mainRecord.current.areas.with_qty });
        break;
      case "without_qty":
        // updateAllProgress();
        dispatch(setTab("without_qty"));
        setLineFilterChoices("without_qty");
        setTabRecord({ ...mainRecord.current.areas.without_qty });
        break;

      default:
        dispatch(setTab("typical"));
        setLineFilterChoices("typical");
        setTabRecord({ ...mainRecord.current.areas.typical });
        break;
    }
  };

  const formChange = useCallback(
    (obj: FormChangeItem) => {
      let updatedRecord = structuredClone(tabRecord);
      if (currentTab === "typical") {
        if (obj.area === "FLOOR" && obj.floorIndex !== undefined) {
          updatedRecord.floors[obj.floorIndex][obj.field] = obj.value;
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

  const filterChange = (value: string, type: string): void => {
    // Quick Action Functions
    const reset = (): void => {
      setLineFilterChoices(currentTab);
      toast.info("Filter Reset", { position: "top-right" });
    };

    const expand = (): void => {
      const updated = structuredClone(tabRecord);
      if (currentTab === "typical") {
        updated.floors.forEach((floor: FloorItem) => {
          floor.collapse = true;
          floor.flats.forEach((flat) => {
            flat.collapse = true;
            flat.areas.forEach((area) => {
              area.collapse = true;
            });
          });
        });
      } else {
        updated.areas.forEach((area: AreaItem) => {
          area.collapse = true;
        });
      }

      setTabRecord(updated);
      toast.info("All Sections Expanded", { position: "top-right" });
    };

    const collapse = (): void => {
      const updated = structuredClone(tabRecord);
      if (currentTab === "typical") {
        updated.floors.forEach((floor: FloorItem) => {
          floor.collapse = false;
          floor.flats.forEach((flat) => {
            flat.collapse = false;
            flat.areas.forEach((area) => {
              area.collapse = false;
            });
          });
        });
      } else {
        updated.areas.forEach((area: AreaItem) => {
          area.collapse = true;
        });
      }

      setTabRecord(updated);
      toast.info("All Sections Collapsed", { position: "top-right" });
    };

    if (type === "line") {
      let filt = filter;
      filt.lineItemFilter.value = value;
      setFilter({ ...filt });
    }

    if (type === "status") {
      let filt = filter;
      filt.statusFilter.value = value;
      setFilter({ ...filt });
    }

    if (type === "quick") {
      switch (value) {
        case "reset":
          reset();
          break;
        case "expand":
          expand();
          break;
        case "collapse":
          collapse();
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
    // POST API Call With postBody

    // Here i am simply triggering Download (you can avoid if you are calling POST API)

    // Convert JSON to string
    const jsonStr = JSON.stringify(postBody, null, 2);

    // Create a blob and trigger download
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "POST-JSON.json";
    a.click();
    toast.success("Saved Progress", { position: "top-right" });
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
          {((currentTab === "typical" && searchTabRecord?.floors?.length>0 )|| (currentTab !== "typical" && searchTabRecord?.areas?.length>0) )?<div className="flex flex-row w-full justify-start align-baseline">
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
          </div>:<Label className="my-2">No Record Found...</Label>}
        </div>
      </div>
    </div>
  );
}

export default App;
