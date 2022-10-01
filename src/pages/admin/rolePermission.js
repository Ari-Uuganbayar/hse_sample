import React, { useEffect } from "react";
import { useRolePermissionContext } from "src/contexts/admin/rolePermissionContext";
import * as API from "src/api/request";

import { Spin, Checkbox } from "antd";
import _ from "lodash";

const Role = () => {
  const { state, dispatch, message } = useRolePermissionContext();

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
      dispatch({ type: "PERMISSION_LOADING", data: true });
      API.getRolePermissionList({ roleid: state.role_id })
        .then((res) => {
          dispatch({ type: "PERMISSION_LIST", data: res });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: "Эрхийн жагсаалт татаж чадсангүй",
          });
        })
        .finally(() => dispatch({ type: "PERMISSION_LOADING", data: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.role_id, state.refresh]);

  return (
    <div className="w-full bg-white text-xs border rounded-lg shadow p-4">
      <div className="w-full flex flex-col lg:flex-row gap-2">
        <div className="w-full lg:w-1/2">
          <Spin spinning={state.role_loading} tip="Боловсруулж байна...">
            <div className="border-b p-3">
              <span className="font-semibold">Бүлэг</span>
            </div>

            <div className="mt-3 overflow-auto">
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
                            ? " bg-primary_blue text-white font-semibold"
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
          <Spin spinning={state.permission_loading} tip="Боловсруулж байна...">
            <div className="border-b p-3">
              <span className="font-semibold">Эрх</span>
            </div>
            <div className="mt-3 overflow-auto">
              <table className="w-full text-xs">
                <thead className="font-semibold">
                  <tr>
                    <th className="w-10 p-1 text-center border"></th>
                    <th className="w-10 p-1 text-center border">№</th>
                    <th className="p-1 text-center border">Төрөл</th>
                    <th className="p-1 text-center border">Нэр</th>
                  </tr>
                </thead>
                <tbody>
                  {state.permission_list.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-1 text-orange-500 italic font-semibold border"
                      >
                        Мэдээлэл олдсонгүй
                      </td>
                    </tr>
                  )}
                  {_.map(state.permission_list, (item, index) => {
                    return (
                      <tr key={index}>
                        <td className="w-10 text-center border">
                          <Checkbox
                            checked={item.ischecked}
                            onChange={(e) => {
                              API.postRolePermission({
                                roleid: state.role_id,
                                permissionid: item.permissionid,
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
                          />
                        </td>
                        <td className="w-10 text-center border">{index + 1}</td>
                        <td className="px-3 py-1 border">
                          {item.permissionconstantname}
                        </td>
                        <td className="px-3 py-1 border">
                          {item.permissiontitle}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Role);
