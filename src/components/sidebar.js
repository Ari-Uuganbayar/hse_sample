import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "src/contexts/userContext";
import * as utils from "src/lib/utils";
import _ from "lodash";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, userDispatch } = useUserContext();

  return (
    <aside
      className={
        "absolute z-10 lg:relative w-80 h-screen bg-white text-primary_blue shadow tracking-tight duration-300 " +
        (user.template.sidebar
          ? "translate-x-0"
          : "-translate-x-full lg:w-0 lg:hidden")
      }
    >
      <div className="w-full h-10 flex items-center justify-center border-b border-r">
        Ажлын байрны хэмжилт
      </div>

      <ul className="relative px-3 mt-6 text-xs font-semibold">
        {_.map(utils.tree_menu_sidebar(user.list_menu), (menu1) => {
          var hasChild = menu1.children.length > 0;
          return (
            <li key={menu1.menuid}>
              <div
                className={
                  "block cursor-pointer px-2 rounded-xl " +
                  (user.template.menu1 === menu1.menuid &&
                  (user.template.menu2 === 0 || !hasChild)
                    ? "bg-primary_blue text-white"
                    : "hover:bg-gray-200")
                }
                onClick={() => {
                  userDispatch({
                    type: "MENU1",
                    data:
                      user.template.menu1 !== menu1.menuid ? menu1.menuid : 0,
                  });
                  if (hasChild) {
                    userDispatch({
                      type: "MENU2",
                      data: 0,
                    });
                  } else {
                    navigate(menu1.route);
                  }
                }}
              >
                <div className="w-full flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 flex items-center justify-center text-lg">
                      <ion-icon name="home-outline" />
                    </div>
                    <span className="">{menu1.menuname}</span>
                  </div>
                  {hasChild && (
                    <div
                      className={
                        "flex items-center cursor-pointer duration-300" +
                        (user.template.menu1 === menu1.menuid
                          ? " -rotate-90"
                          : "")
                      }
                    >
                      <ion-icon name="chevron-back-outline" />
                    </div>
                  )}
                </div>
              </div>
              {hasChild && (
                <ul
                  className={
                    "duration-300 " +
                    (user.template.menu1 === menu1.menuid
                      ? "h-full"
                      : "hidden scale-0 origin-left")
                  }
                >
                  {_.map(menu1.children, (menu2) => {
                    return (
                      <li
                        key={menu2.menuid}
                        className={
                          "block py-3 px-7 cursor-pointer rounded-xl " +
                          (user.template.menu2 === menu2.menuid
                            ? "bg-primary_blue text-white"
                            : "hover:bg-gray-300")
                        }
                        onClick={() => {
                          userDispatch({
                            type: "MENU2",
                            data: menu2.menuid,
                          });

                          menu2.route !== null && navigate(menu2.route);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 flex items-center justify-center text-lg">
                            <ion-icon name="home-outline" />
                          </div>
                          <span className="">{menu2.menuname}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default React.memo(Sidebar);
