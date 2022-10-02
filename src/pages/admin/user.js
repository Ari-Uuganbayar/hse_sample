import React, { useEffect, useState } from "react";
import { useUserContext } from "src/contexts/admin/userContext";
import * as API from "src/api/request";

import { Spin, Modal, Input, Select, Checkbox } from "antd";
import _ from "lodash";
import Swal from "sweetalert2";
const { Option } = Select;

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

  useEffect(() => {
    API.getRoleList()
      .then((res) => {
        dispatch({ type: "LIST_ROLE", data: res });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Бүлгийн жагсаалт татаж чадсангүй",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          title: "Хэрэглэгчийн мэдээлэл татаж чадсангүй",
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
          isactive: state.isactive ? 1 : 0,
        })
          .then((res) => {
            API.postUserRole({
              userid: res.id,
              roles: state.role.length === 0 ? "" : state.role.join(","),
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
                  title: "Хэрэглэгч бүлэг бүртгэж чадсангүй",
                });
              });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Хэрэглэгч бүртгэж чадсангүй",
            });
          });
      } else {
        API.putUser(state.id, {
          username: state.username,
          shortname: state.shortname,
          isactive: state.isactive ? 1 : 0,
        })
          .then(() => {
            API.postUserRole({
              userid: state.id,
              roles: state.role.length === 0 ? "" : state.role.join(","),
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
                  title: "Хэрэглэгч бүлэг засварлаж чадсангүй",
                });
              });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Хэрэглэгч засварлаж чадсангүй",
            });
          });
      }
    }
  };

  const updatePassword = (item) => {
    dispatch({ type: "ID", data: item.id });
    dispatch({ type: "PASSWORD_NEW", data: null });
    dispatch({ type: "PASSWORD_MODAL", data: true });
  };

  const savePassword = () => {
    var error = [];
    state.password_new || error.push("Нууц үг");

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
      API.putUserPassword(state.id, {
        password: state.password_new,
      })
        .then(() => {
          message({ type: "success", title: "Амжилттай хадгалагдлаа" });
          dispatch({ type: "PASSWORD_MODAL", data: false });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: "Хэрэглэгчийн нууц үг засварлаж чадсангүй",
          });
        });
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
        <div className="flex flex-col text-xs">
          <div className="w-full flex flex-col lg:flex-row lg:items-center border-b mb-2 pb-2">
            <span className="lg:w-1/4 font-semibold">
              Нэвтрэх нэр:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="lg:w-3/4">
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
          <div className="w-full flex flex-col lg:flex-row lg:items-center border-b mb-2 pb-2">
            <span className="lg:w-1/4 font-semibold">
              Овог, нэр:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="lg:w-3/4">
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

          {state.id === null && (
            <div className="w-full flex flex-col lg:flex-row lg:items-center border-b mb-2 pb-2">
              <span className="lg:w-1/4 font-semibold">
                Нууц үг:<b className="ml-1 text-red-500">*</b>
              </span>
              <div className="lg:w-3/4">
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
          )}

          <div className="w-full flex flex-col lg:flex-row lg:items-center border-b mb-2 pb-2">
            <span className="lg:w-1/4 font-semibold">
              Хэрэглэгчийн бүлэг:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="lg:w-3/4">
              <Select
                mode="multiple"
                className="w-full"
                placeholder="Сонгоно уу."
                value={state.role}
                onChange={(value) => {
                  dispatch({
                    type: "ROLE",
                    data: value,
                  });
                }}
              >
                {_.map(state.list_role, (item, index) => {
                  return (
                    <Option key={"role_" + index} value={item.roleid}>
                      {item.roletitle}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row lg:items-center border-b mb-2 pb-2">
            <span className="lg:w-1/4 font-semibold">
              Идэвхтэй эсэх:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="lg:w-3/4">
              <Checkbox
                checked={state.isactive}
                onChange={(e) => {
                  dispatch({ type: "ISACTIVE", data: e.target.checked });
                }}
              />
            </div>
          </div>
        </div>

        <div className="my-3 border" />

        <button
          className="w-full py-1 flex items-center justify-center font-semibold text-primary border-2 border-primary rounded-md hover:bg-primary hover:text-white focus:outline-none duration-300 text-xs"
          onClick={() => save()}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>

      <Modal
        centered
        width={700}
        title={<div className="text-center">Нууц үг солих цонх</div>}
        visible={state.password_modal}
        onCancel={() => dispatch({ type: "PASSWORD_MODAL", data: false })}
        footer={null}
      >
        <div className="flex flex-col text-xs">
          <div className="w-full flex flex-col lg:flex-row lg:items-center border-b mb-2 pb-2">
            <span className="lg:w-1/4 font-semibold">
              Нууц үг:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="lg:w-3/4">
              <Input.Password
                placeholder="Нууц үг"
                value={state.password_new}
                onChange={(e) =>
                  dispatch({
                    type: "PASSWORD_NEW",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="my-3 border" />

        <button
          className="w-full py-1 flex items-center justify-center font-semibold text-primary border-2 border-primary rounded-md hover:bg-primary hover:text-white focus:outline-none duration-300 text-xs"
          onClick={() => savePassword()}
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
              className="px-5 py-1 flex items-center justify-center font-semibold text-primary border-2 border-primary rounded-md hover:bg-primary hover:text-white focus:outline-none duration-300 text-xs"
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
                  <th className="p-1 text-center border">Хэрэглэгчийн бүлэг</th>
                  <th className="w-16 p-1 text-center border">Идэвхтэй эсэх</th>
                  <th className="w-16 p-1 text-center border"></th>
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
                      <td className="px-3 py-1 border">{item.roles}</td>
                      <td className="p-1 text-center border">
                        {item.isactive ? (
                          <div className="flex items-center justify-center text-lg text-green-500">
                            <ion-icon name="checkmark-circle" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-lg text-red-500">
                            <ion-icon name="close-circle" />
                          </div>
                        )}
                      </td>
                      <td className="w-20 p-1 text-center border">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="flex items-center justify-center text-lg text-blue-500 cursor-pointer font-semibold"
                            onClick={() => updatePassword(item)}
                          >
                            <ion-icon name="lock-open" />
                          </div>
                          <div
                            className="flex items-center justify-center text-xl text-yellow-500 cursor-pointer"
                            onClick={() => updateItem(item)}
                          >
                            <ion-icon name="create-outline" />
                          </div>
                          <div
                            className="ml-4 flex items-center justify-center text-lg text-red-500 cursor-pointer"
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
