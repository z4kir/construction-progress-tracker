
// import './App.css'

import { useSelector } from "react-redux";
import { useDeviceListener } from "./app/hooks/useDeviceListener";
import type { RootState } from "./app/store";

const TabView = () => {
  return <></>;
};

function App() {
  // sets devicetype according to screen width
  useDeviceListener();

  const deviceType = useSelector((state: RootState) => state.device.type); // can be Mobile , Tablet or Desktop

  return (
    <div className="flex  align-middle min-h-screen min-w-screen flex-col   items-center justify-center">
      <h1 className="text-4xl font-bold text-center text-blue-600">
        Hello React 18 + Tailwind!
      </h1>
      <h1>You're using: {deviceType}</h1>
    </div>
  );
}

export default App;
