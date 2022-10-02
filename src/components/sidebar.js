import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "src/contexts/appContext";
import * as utils from "src/lib/utils";
import _ from "lodash";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, appDispatch } = useAppContext();

  return (
    <aside
      className={
        "absolute z-10 lg:relative w-80 h-screen bg-white shadow duration-300 overflow-auto " +
        (user.template.sidebar
          ? "translate-x-0"
          : "-translate-x-full lg:w-0 lg:hidden")
      }
    >
      <div className="w-full h-10 flex items-center justify-center text-primary border-b border-r">
        Ажлын байрны хэмжилт
      </div>

      <ul className="relative mt-6 text-xs font-medium">
        {_.map(utils.tree_menu_sidebar(user.list_menu), (menu1) => {
          var hasChild = menu1.children.length > 0;
          return (
            <li key={menu1.menuid}>
              <div
                className={
                  "block py-3 pl-5 pr-3 cursor-pointer " +
                  (user.template.menu1 === menu1.menuid
                    ? "text-primary border-r-4 border-primary"
                    : "hover:text-primary")
                }
                onClick={() => {
                  appDispatch({
                    type: "MENU1",
                    data:
                      user.template.menu1 !== menu1.menuid ? menu1.menuid : 0,
                  });
                  if (hasChild) {
                    appDispatch({
                      type: "MENU2",
                      data: 0,
                    });
                  } else {
                    navigate(menu1.route);
                  }
                }}
              >
                <div className="flex items-center justify-between">
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
                    "list-disc list-inside duration-300 " +
                    (user.template.menu1 === menu1.menuid
                      ? ""
                      : "hidden scale-0 origin-left")
                  }
                >
                  {_.map(menu1.children, (menu2) => {
                    return (
                      <li
                        key={menu2.menuid}
                        className={
                          "block py-3 pl-16 pr-3 cursor-pointer " +
                          (user.template.menu2 === menu2.menuid
                            ? "text-primary font-semibold"
                            : "hover:text-primary")
                        }
                        onClick={() => {
                          appDispatch({
                            type: "MENU2",
                            data: menu2.menuid,
                          });
                          menu2.route !== null && navigate(menu2.route);
                        }}
                      >
                        {menu2.menuname}
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
