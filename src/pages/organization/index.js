import React, { useEffect, useState } from "react";
import { useOrganizationContext } from "src/contexts/organizationContext";
import * as API from "src/api/request";

import { Spin, Modal, Tree, Select, TreeSelect, Input } from "antd";
import _ from "lodash";
import Swal from "sweetalert2";
const { Option } = Select;
const { TextArea } = Input;

const Index = () => {
  const { state, dispatch, message } = useOrganizationContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.getOrganizationList()
      .then((res) => dispatch({ type: "LIST", data: res }))
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Жасгаалт татаж чадсангүй",
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

  const save = () => {
    var error = [];
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
        rorganizationtypeid: state.type,
        parentid: state.parentid,
        organizationname: state.name,
        description: state.description === null ? "" : state.description,
      };

      if (state.id === null) {
        API.postOrganization(data)
          .then(() => {
            dispatch({ type: "REFRESH" });
            dispatch({ type: "CLEAR" });
            dispatch({ type: "MODAL", data: false });
            message({ type: "success", title: "Амжилттай хадгалагдлаа" });
          })
          .catch((error) => {
            message({ type: "error", error, title: "Бүртгэж чадсангүй" });
          });
      } else {
        API.putOrganization(state.id, data)
          .then(() => {
            dispatch({ type: "REFRESH" });
            dispatch({ type: "CLEAR" });
            dispatch({ type: "MODAL", data: false });
            message({ type: "success", title: "Амжилттай хадгалагдлаа" });
          })
          .catch((error) => {
            message({ type: "error", error, title: "Засварлаж чадсангүй" });
          });
      }
    }
  };

  const updateItem = (item) => {
    API.getOrganization(item.id)
      .then((res) => {
        dispatch({ type: "SET", data: res });
        dispatch({ type: "MODAL", data: true });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Мэдээлэл татаж чадсангүй",
        });
      });
  };

  const deleteItem = (id) => {
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
        API.deleteOrganization(id)
          .then(() => {
            dispatch({ type: "REFRESH" });
            dispatch({ type: "MODAL", data: false });
            message({ type: "success", title: "Амжилттай устгагдлаа" });
          })
          .catch((error) => {
            message({ type: "error", error, title: "Устгаж чадсангүй" });
          });
      }
    });
  };

  return (
    <>
      <Modal
        closable={false}
        centered
        width={700}
        title={<div className="text-center">Бүртгэл</div>}
        visible={state.modal}
        onCancel={() => dispatch({ type: "MODAL", data: false })}
        footer={null}
      >
        <div className="flex flex-col gap-5 text-xs">
          <div className="">
            <span className="block font-semibold">
              Төрөл:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Select
                className="w-full mt-1"
                placeholder="Сонгоно уу."
                value={state.type}
                onChange={(value) =>
                  dispatch({
                    type: "TYPE",
                    data: value,
                  })
                }
              >
                <Option value={1}>Дотоод</Option>
                <Option value={2}>Гадны</Option>
              </Select>
            </div>
          </div>

          {state.type === 1 && (
            <div className="">
              <span className="block font-semibold">Дээд байгууллага:</span>
              <div className="mt-1">
                <TreeSelect
                  showSearch
                  allowClear={true}
                  className="w-full"
                  placeholder="Сонгоно уу"
                  treeDataSimpleMode={true}
                  treeData={state.list}
                  treeLine={(true, { showLeafIcon: false })}
                  value={state.parentid}
                  onChange={(value) =>
                    dispatch({
                      type: "PARENT",
                      data: value,
                    })
                  }
                  filterTreeNode={(search, item) => {
                    return (
                      item.title.props.children
                        .toLowerCase()
                        .indexOf(search.toLowerCase()) >= 0
                    );
                  }}
                />
              </div>
            </div>
          )}

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

          <div className="w-full">
            <span className="font-semibold">Тайлбар:</span>
            <div className="mt-1">
              <TextArea
                className=""
                value={state.description}
                onChange={(e) =>
                  dispatch({
                    type: "DESCRIPTION",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>
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

      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <div className="min-h-[calc(100vh-64px)] bg-white text-xs border rounded-lg shadow">
          <div className="border-b p-3">
            <span className="font-semibold">Байгууллага цонх</span>
          </div>
          <div className="max-h-[calc(100vh-145px)] p-3 text-xs overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <button
                className="px-5 py-1 flex items-center justify-center font-semibold text-primary_blue border-2 border-primary_blue rounded-md hover:bg-primary_blue hover:text-white focus:outline-none duration-300 text-xs"
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

            {/* <table className="w-full text-xs">
              <thead className="font-semibold">
                <tr>
                  <th className="w-10 text-center p-1 border">№</th>
                  <th className="text-center p-1 border">Байгууллагын нэр</th>
                  <th className="text-center p-1 border">Тайлбар</th>
                  <th className="w-56 text-center p-1 border">Бүртгэсэн</th>
                  <th className="w-20 text-center p-1 border">#</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-1 text-orange-500 italic border"
                    >
                      Мэдээлэл олдсонгүй.
                    </td>
                  </tr>
                )}
                {_.map(list, (item, index) => {
                  return (
                    <tr key={item.id}>
                      <td className="p-1 text-center border">{index + 1}</td>
                      <td className="px-3 py-1 border">
                        {item.organizationname}
                      </td>
                      <td className="px-3 py-1 border">{item.description}</td>
                      <td className="p-1 text-center border">
                        <span className="mr-2 italic">
                          {moment(item.insertdate).format("YYYY.MM.DD")}
                        </span>
                        <span>{item.insertusername}</span>
                      </td>
                      <td className="border">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="flex items-center justify-center text-xl text-yellow-500 cursor-pointer"
                            onClick={() => {
                              dispatch({
                                type: "SET",
                                data: item,
                              });
                              dispatch({
                                type: "MODAL",
                                data: true,
                              });
                            }}
                          >
                            <ion-icon name="create-outline" />
                          </div>
                          <div
                            className="flex items-center justify-center text-lg text-red-500 cursor-pointer"
                            onClick={() => deleteItem(item.id)}
                          >
                            <ion-icon name="trash-outline" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table> */}

            <div className="w-full mt-5 border">
              <Tree
                selectable={true}
                showLine={{ showLeafIcon: false }}
                showIcon={false}
                treeData={state.list}
                titleRender={(data) => {
                  return (
                    <div className="w-full px-3 flex items-center justify-between border">
                      <div>{data.menuname}</div>
                      <div>{data.route}</div>
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="flex items-center justify-center text-xl text-yellow-500 cursor-pointer"
                          onClick={() => updateItem(data)}
                        >
                          <ion-icon name="create-outline" />
                        </div>
                        <div
                          className="flex items-center justify-center text-lg text-red-500 cursor-pointer"
                          onClick={() => deleteItem(data)}
                        >
                          <ion-icon name="trash-outline" />
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default React.memo(Index);
