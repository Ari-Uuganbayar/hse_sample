import React, { useEffect, useState } from "react";
import { usePermissionContext } from "src/contexts/admin/permissionContext";
import * as API from "src/api/request";

import { Spin, Modal, Input } from "antd";
import _ from "lodash";
import Swal from "sweetalert2";

const Permission = () => {
  const { state, dispatch, message } = usePermissionContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.getPermissionList()
      .then((res) => {
        dispatch({ type: "LIST", data: res });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Эрхийн жагсаалт татаж чадсангүй",
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

  const updateItem = (item) => {
    API.getPermission(item.permissionid)
      .then((res) => {
        dispatch({ type: "SET", data: res });
        dispatch({ type: "MODAL", data: true });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Цэсний жасгаалтын мэдээлэл татаж чадсангүй",
        });
      });
  };

  const deleteItem = (item) => {
    Swal.fire({
      title: "",
      text: "Устгахдаа итгэлтэй байна уу?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1890ff",
      cancelButtonColor: "rgb(244, 106, 106)",
      confirmButtonText: "Тийм",
      cancelButtonText: "Үгүй",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.deletePermission(item.permissionid)
          .then(() => {
            message({
              type: "success",
              title: "Амжилттай устгагдлаа.",
            });
            dispatch({ type: "REFRESH" });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Устгаж чадсангүй",
            });
          });
      }
    });
  };

  const save = () => {
    var error = [];
    state.type || error.push("Төрөл");
    state.name || error.push("Нэр");

    if (error.length > 0) {
      message({
        type: "warning",
        title: (
          <div className="text-orange-500 font-semibold">
            Дараах мэдээлэл дутуу байна
          </div>
        ),
        description: (
          <div className="flex flex-col gap-1">
            {_.map(error, (item, index) => (
              <div key={index}>
                - <span className="ml-1">{item}</span>
              </div>
            ))}
          </div>
        ),
      });
    } else {
      var data = {
        permissionconstantname: state.type,
        permissiontitle: state.name,
      };

      if (state.id === null) {
        API.postPermission(data)
          .then(() => {
            message({ type: "success", title: "Амжилттай хадгалагдлаа" });
            dispatch({ type: "REFRESH" });
            dispatch({ type: "MODAL", data: false });
            dispatch({ type: "CLEAR" });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Үүрэг бүртгэж чадсангүй",
            });
          });
      } else {
        API.putPermission(state.id, data)
          .then(() => {
            message({ type: "success", title: "Амжилттай хадгалагдлаа" });
            dispatch({ type: "REFRESH" });
            dispatch({ type: "MODAL", data: false });
            dispatch({ type: "CLEAR" });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Үүрэг засварлаж чадсангүй",
            });
          });
      }
    }
  };

  return (
    <>
      <Modal
        centered
        width={700}
        title={<div className="text-center">Бүртгэл</div>}
        visible={state.modal}
        onCancel={() => dispatch({ type: "MODAL", data: false })}
        footer={null}
      >
        <div className="flex flex-col gap-5 text-xs">
          <div className="">
            <span className="font-semibold">
              Төрөл:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Input
                value={state.type}
                onChange={(e) =>
                  dispatch({
                    type: "TYPE",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="">
            <span className="font-semibold">
              Нэр:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Input
                value={state.name}
                onChange={(e) =>
                  dispatch({
                    type: "NAME",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="my-3 border" />

        <button
          className="w-full py-1 flex items-center justify-center font-semibold bg-primary text-white border-2 border-primary rounded-md hover:bg-white hover:text-primary focus:outline-none duration-300 text-xs"
          onClick={() => save()}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>

      <Spin spinning={loading} tip="Боловсруулж байна...">
        <div className="border-b p-3">
          <span className="font-semibold">Эрх</span>
        </div>
        <div className="flex flex-col p-3">
          <div className="w-full">
            <button
              className="px-5 py-1 flex items-center justify-center font-semibold bg-primary text-white border-2 border-primary rounded-md hover:bg-white hover:text-primary focus:outline-none duration-300 text-xs"
              onClick={() => {
                dispatch({ type: "CLEAR" });
                dispatch({ type: "MODAL", data: true });
              }}
            >
              <div className="flex items-center font-semibold text-xl">
                <ion-icon name="add-circle-outline" />
              </div>
              <span className="ml-2">Нэмэх</span>
            </button>
          </div>

          <div className="mt-3 max-h-[calc(100vh-175px)] overflow-auto">
            <table className="w-full text-xs border-separate border-spacing-0">
              <thead className="sticky top-0 bg-white font-semibold">
                <tr>
                  <th className="w-10 p-1 text-center border">№</th>
                  <th className="p-1 text-center border">Төрөл</th>
                  <th className="p-1 text-center border">Нэр</th>
                  <th className="w-20 p-1 text-center border"></th>
                </tr>
              </thead>
              <tbody>
                {state.list.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-1 text-orange-500 italic font-semibold border"
                    >
                      Мэдээлэл олдсонгүй
                    </td>
                  </tr>
                )}
                {_.map(state.list, (item, index) => {
                  return (
                    <tr key={index}>
                      <td className="w-10 text-center border">{index + 1}</td>
                      <td className="px-3 py-1 border">
                        {item.permissionconstantname}
                      </td>
                      <td className="px-3 py-1 border">
                        {item.permissiontitle}
                      </td>
                      <td className="w-20 text-center border">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="flex items-center justify-center text-xl text-yellow-500 cursor-pointer"
                            onClick={() => updateItem(item)}
                          >
                            <ion-icon name="create-outline" />
                          </div>
                          <div
                            className="flex items-center justify-center text-lg text-red-500 cursor-pointer"
                            onClick={() => deleteItem(item)}
                          >
                            <ion-icon name="trash-outline" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default React.memo(Permission);
