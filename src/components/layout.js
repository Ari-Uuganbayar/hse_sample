import React from "react";
import { useAppContext } from "src/contexts/appContext";
import Sidebar from "src/components/sidebar";
import Header from "src/components/header";

const Layout = ({ children }) => {
  const { user, appDispatch } = useAppContext();

  return (
    <div className="relative w-screen h-screen flex bg-gray-200 font-poppins">
      {user.template.sidebar && (
        <div
          className="absolute z-10 lg:hidden w-screen h-screen bg-gray-800 opacity-60"
          onClick={() => appDispatch({ type: "SIDEBAR" })}
        ></div>
      )}
      <Sidebar />
      <main
        className={
          "w-full" + (user.template.sidebar ? " lg:w-[calc(100%-320px)]" : "")
        }
      >
        <Header />
        <div className="w-full p-3">{children}</div>
      </main>
    </div>
  );
};

export default React.memo(Layout);
