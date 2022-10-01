import React, { useEffect } from "react";
import { useUserRoleContext } from "src/contexts/admin/userRoleContext";
import * as API from "src/api/request";

import { Spin, Checkbox } from "antd";
import _ from "lodash";

const Role = () => {
  const { state, dispatch, message } = useUserRoleContext();

  useEffect(() => {
    dispatch({ type: "USER_LOADING", data: true });
    API.getUserList()
      .then((res) => {
        dispatch({ type: "USER_LIST", data: res });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Бүлгийн жагсаалт татаж чадсангүй",
        });
      })
      .finally(() => dispatch({ type: "USER_LOADING", data: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.user_id) {
      dispatch({ type: "ROLE_LOADING", data: true });
      API.getUserRoleList({ userid: state.user_id })
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user_id, state.refresh]);

  return (
    <div className="w-full bg-white text-xs border rounded-lg shadow p-4">
      <div className="w-full flex flex-col lg:flex-row gap-2">
        <div className="w-full lg:w-1/2">
          <Spin spinning={state.user_loading} tip="Боловсруулж байна...">
            <div className="border-b p-3">
              <span className="font-semibold">Хэрэглэгч</span>
            </div>

            <div className="mt-3 overflow-auto">
              <table className="w-full text-xs">
                <thead className="font-semibold">
                  <tr>
                    <th className="w-10 p-1 text-center border">№</th>
                    <th className="p-1 text-center border">Хэрэглэгчийн нэр</th>
                    <th className="p-1 text-center border">Овог, нэр</th>
                  </tr>
                </thead>
                <tbody>
                  {state.user_list.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-3 py-1 text-orange-500 italic font-semibold border"
                      >
                        Мэдээлэл олдсонгүй
                      </td>
                    </tr>
                  )}
                  {_.map(state.user_list, (item, index) => {
                    return (
                      <tr
                        key={index}
                        className={
                          "cursor-pointer" +
                          (state.user_id === item.id
                            ? " bg-primary_blue text-white font-semibold"
                            : "")
                        }
                        onClick={() =>
                          dispatch({
                            type: "USER_ID",
                            data: state.user_id === item.id ? null : item.id,
                          })
                        }
                      >
                        <td className="w-10 text-center border">{index + 1}</td>
                        <td className="px-3 py-1 border">{item.username}</td>
                        <td className="px-3 py-1 border">{item.shortname}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Spin>
        </div>

        <div className="lg:w-1/2">
          <Spin spinning={state.role_loading} tip="Боловсруулж байна...">
            <div className="border-b p-3">
              <span className="font-semibold">Бүлэг</span>
            </div>
            <div className="mt-3 overflow-auto">
              <table className="w-full text-xs">
                <thead className="font-semibold">
                  <tr>
                    <th className="w-10 p-1 text-center border"></th>
                    <th className="w-10 p-1 text-center border">№</th>
                    <th className="p-1 text-center border">Нэр</th>
                  </tr>
                </thead>
                <tbody>
                  {state.role_list.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-1 text-orange-500 italic font-semibold border"
                      >
                        Мэдээлэл олдсонгүй
                      </td>
                    </tr>
                  )}
                  {_.map(state.role_list, (item, index) => {
                    return (
                      <tr key={index}>
                        <td className="w-10 text-center border">
                          <Checkbox
                            checked={item.ischecked}
                            onChange={(e) => {
                              API.postUserRole({
                                userid: state.user_id,
                                roleid: item.roleid,
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
                        <td className="px-3 py-1 border">{item.roletitle}</td>
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
