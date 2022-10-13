import React, { useEffect } from "react";
import { useRoleMenuContext } from "src/contexts/admin/roleMenuContext";
import * as API from "src/api/request";
import * as utils from "src/lib/utils";

import { Spin, Tree, Checkbox } from "antd";
import _ from "lodash";

const RoleMenu = () => {
  const { state, dispatch, message } = useRoleMenuContext();

  useEffect(() => {
    dispatch({ type: "ROLE_LOADING", data: true });
    API.getRoleList()
      .then((res) => {
        dispatch({ type: "ROLE_LIST", data: res });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Бүлгийн жагсаалт татаж чадсангүй",
        });
      })
      .finally(() => dispatch({ type: "ROLE_LOADING", data: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.role_id) {
      dispatch({ type: "MENU_LOADING", data: true });
      API.getRoleMenuList({ roleid: state.role_id })
        .then((res) => {
          dispatch({ type: "MENU_LIST", data: res });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: "Эрхийн жагсаалт татаж чадсангүй",
          });
        })
        .finally(() => dispatch({ type: "MENU_LOADING", data: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.role_id, state.refresh]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-2">
        <div className="w-full lg:w-1/2">
          <Spin spinning={state.role_loading} tip="Боловсруулж байна...">
            <div className="border-b p-3">
              <span className="font-semibold">Бүлэг</span>
            </div>

            <div className="mt-3 px-3 overflow-auto">
              <table className="w-full text-xs">
                <thead className="font-semibold">
                  <tr>
                    <th className="w-10 p-1 text-center border">№</th>
                    <th className="p-1 text-center border">Нэр</th>
                  </tr>
                </thead>
                <tbody>
                  {state.role_list.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-3 py-1 text-orange-500 italic font-semibold border"
                      >
                        Мэдээлэл олдсонгүй
                      </td>
                    </tr>
                  )}
                  {_.map(state.role_list, (item, index) => {
                    return (
                      <tr
                        key={index}
                        className={
                          "cursor-pointer" +
                          (state.role_id === item.roleid
                            ? " bg-primary text-white font-semibold"
                            : "")
                        }
                        onClick={() =>
                          dispatch({
                            type: "ROLE_ID",
                            data:
                              state.role_id === item.roleid
                                ? null
                                : item.roleid,
                          })
                        }
                      >
                        <td className="w-10 text-center border">{index + 1}</td>
                        <td className="px-3 py-1 border">{item.roletitle}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Spin>
        </div>

        <div className="lg:w-1/2">
          <Spin spinning={state.menu_loading} tip="Боловсруулж байна...">
            <div className="border-b p-3">
              <span className="font-semibold">Цэс</span>
            </div>

            <div className="p-3">
              <Tree
                defaultExpandAll={true}
                selectable={false}
                showLine={{ showLeafIcon: false }}
                showIcon={false}
                treeData={utils.tree_menu(state.menu_list)}
                titleRender={(item) => {
                  return (
                    <div className="px-3 flex items-center border rounded-md">
                      <Checkbox
                        checked={item.ischecked}
                        onChange={(e) => {
                          API.postRoleMenu({
                            roleid: state.role_id,
                            menuid: item.id,
                            ischeck: _.toInteger(e.target.checked),
                          })
                            .then(() => {
                              dispatch({ type: "REFRESH" });
                              message({
                                type: "success",
                                title: "Амжилттай хадгалагдлаа",
                              });
                            })
                            .catch((error) => {
                              message({
                                type: "error",
                                error,
                                title: "Хадгалж чадсангүй",
                              });
                            });
                        }}
                      >
                        {item.menuname}
                      </Checkbox>
                    </div>
                  );
                }}
              />
            </div>
          </Spin>
        </div>
      </div>
    </>
  );
};

export default React.memo(RoleMenu);
