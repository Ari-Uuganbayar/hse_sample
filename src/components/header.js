import React from "react";
import { useUserContext } from "src/contexts/userContext";
import * as API from "src/api/request";

import src from "src/assets/image/user.jpg";

const Header = () => {
  const { user, userDispatch } = useUserContext();

  return (
    <header className="w-full h-10 flex items-center justify-between bg-primary_blue text-white">
      <div
        className="flex items-center ml-4 text-2xl cursor-pointer"
        onClick={() => userDispatch({ type: "SIDEBAR" })}
      >
        <ion-icon name="menu-outline" />
      </div>
      <div className="flex items-center gap-2 mr-2">
        <div className="flex items-center gap-2 mr-1 px-2 border bg-white rounded-lg text-primary_blue">
          <img className="w-8 h-8 object-fit rounded-full" src={src} alt="" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wide">
              {user.username}
            </span>
            <span className="text-[10px] text-center">
              Бүтцийн нэгж - Албан тушаал
            </span>
          </div>
        </div>

        {/* LOG OUT */}
        <div
          className="h-8 w-8 flex items-center justify-center border-2 rounded-full text-xl cursor-pointer hover:scale-110 duration-200"
          onClick={() => {
            API.logOut().then(() => {
              userDispatch({ type: "LOG_OUT" });
              window.location.replace("/login");
            });
          }}
        >
          <ion-icon name="log-out-outline" />
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
