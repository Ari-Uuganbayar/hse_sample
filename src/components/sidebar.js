import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "src/contexts/appContext";
import * as utils from "src/lib/utils";
import _ from "lodash";

const Sidebar = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  return (
    <aside
      className={
        "absolute z-10 lg:relative w-80 h-screen bg-white shadow duration-300 overflow-auto " +
        (state.template.sidebar
          ? "translate-x-0"
          : "-translate-x-full lg:w-0 lg:hidden")
      }
    >
      <div className="w-full h-10 flex items-center justify-center text-primary border-b border-r">
        Ажлын байрны хэмжилт
      </div>

      <ul className="relative mt-6 text-xs font-medium">
        {_.map(utils.tree_menu_sidebar(state.list_menu), (menu1) => {
          var hasChild = menu1.children.length > 0;
          return (
            <li key={menu1.menuid}>
              <div
                className={
                  "block py-3 pl-8 pr-3 cursor-pointer " +
                  (state.template.menu1 === menu1.menuid
                    ? "text-primary border-r-4 border-primary"
                    : "hover:text-primary")
                }
                onClick={() => {
                  dispatch({
                    type: "MENU1",
                    data:
                      state.template.menu1 !== menu1.menuid ? menu1.menuid : 0,
                  });
                  if (hasChild) {
                    dispatch({
                      type: "MENU2",
                      data: 0,
                    });
                  } else {
                    navigate("/" + menu1.route);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="mb-1">&omicron;</span>
                    <span className="">{menu1.menuname}</span>
                  </div>
                  {hasChild && (
                    <div
                      className={
                        "flex items-center cursor-pointer duration-300" +
                        (state.template.menu1 === menu1.menuid
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
                    (state.template.menu1 === menu1.menuid
                      ? ""
                      : "hidden scale-0 origin-left")
                  }
                >
                  {_.map(menu1.children, (menu2) => {
                    return (
                      <li
                        key={menu2.menuid}
                        className={
                          "py-3 pl-14 pr-3 flex items-center gap-1.5 cursor-pointer " +
                          (state.template.menu2 === menu2.menuid
                            ? "text-primary font-semibold"
                            : "hover:text-primary")
                        }
                        onClick={() => {
                          dispatch({
                            type: "MENU2",
                            data: menu2.menuid,
                          });
                          menu2.route !== null && navigate("/" + menu2.route);
                        }}
                      >
                        <span>&diams;</span>
                        <span>{menu2.menuname}</span>
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
