import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDeviceType } from "../features/deviceSlice";

export const useDeviceListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) dispatch(setDeviceType("mobile"));
      else if (width < 1024) dispatch(setDeviceType("tablet"));
      else dispatch(setDeviceType("desktop"));
    };

    updateDeviceType(); // set on first load
    window.addEventListener("resize", updateDeviceType);

    return () => window.removeEventListener("resize", updateDeviceType);
  }, [dispatch]);
};
