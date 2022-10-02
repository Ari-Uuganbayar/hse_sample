import React, { useEffect, useState } from "react";
import { useUserContext } from "src/contexts/admin/userContext";
import * as API from "src/api/request";

import { Spin, Modal, Input, Checkbox } from "antd";
import _ from "lodash";
import Swal from "sweetalert2";

const User = () => {
  const { state, dispatch, message } = useUserContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.getUserList()
      .then((res) => {
        dispatch({ type: "LIST", data: res });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Жагсаалт татаж чадсангүй",
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

  const updateItem = (item) => {
    API.getUser(item.id)
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
        API.deleteUser(item.id)
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
    state.username || error.push("Нэвтрэх нэр");
    state.shortname || error.push("Овог, нэр");
    if (state.id === null) {
      state.password || error.push("Нууц үг");
    }

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
      if (state.id === null) {
        API.postUser({
          username: state.username,
          shortname: state.shortname,
          password: state.password,
          isadmin: state.isadmin ? 1 : 0,
        })
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
              title: "Эрх бүртгэж чадсангүй",
            });
          });
      } else {
        API.putUser(state.id, {
          username: state.username,
          shortname: state.shortname,
          isadmin: state.isadmin ? 1 : 0,
        })
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
              title: "Эрх засварлаж чадсангүй",
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
              Нэвтрэх нэр:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Input
                value={state.username}
                onChange={(e) =>
                  dispatch({
                    type: "USERNAME",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="">
            <span className="font-semibold">
              Овог, нэр:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Input
                value={state.shortname}
                onChange={(e) =>
                  dispatch({
                    type: "SHORTNAME",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="">
            <span className="font-semibold">
              Нууц үг:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Input.Password
                placeholder="Нууц үг"
                value={state.password}
                onChange={(e) =>
                  dispatch({
                    type: "PASSWORD",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <Checkbox
            value={state.isadmin}
            onChange={(e) => {
              dispatch({ type: "ISADMIN", data: e.target.checked });
            }}
          >
            Админ эсэх
          </Checkbox>
        </div>

        <div className="my-3 border" />

        <button
          className="w-full py-1 flex items-center justify-center font-semibold text-primary_blue border-2 border-primary_blue rounded-md hover:bg-primary_blue hover:text-white focus:outline-none duration-300 text-xs"
          onClick={() => save()}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>

      <Spin spinning={loading} tip="Боловсруулж байна...">
        <div className="border-b p-3">
          <span className="font-semibold">Хэрэглэгч</span>
        </div>
        <div className="flex flex-col p-3">
          <div className="w-full">
            <button
              className="px-5 py-1 flex items-center justify-center font-semibold text-primary_blue border-2 border-primary_blue rounded-md hover:bg-primary_blue hover:text-white focus:outline-none duration-300 text-xs"
              onClick={() => {
                dispatch({ type: "CLEAR", data: true });
                dispatch({ type: "MODAL", data: true });
              }}
            >
              <div className="flex items-center font-semibold text-xl">
                <ion-icon name="add-circle-outline" />
              </div>
              <span className="ml-2">Нэмэх</span>
            </button>
          </div>

          <div className="mt-3 overflow-auto">
            <table className="w-full text-xs">
              <thead className="font-semibold">
                <tr>
                  <th className="w-10 p-1 text-center border">№</th>
                  <th className="p-1 text-center border">Нэвтрэх нэр</th>
                  <th className="p-1 text-center border">Овог, нэр</th>
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
                      <td className="px-3 py-1 border">{item.username}</td>
                      <td className="px-3 py-1 border">{item.shortname}</td>
                      <td className="w-20 p-1 text-center border">
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

export default React.memo(User);
