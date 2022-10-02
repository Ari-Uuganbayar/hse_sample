import React, { useEffect, useState } from "react";
import { useMenuContext } from "src/contexts/admin/menuContext";
import * as API from "src/api/request";
import * as utils from "src/lib/utils";
import "./menu.css";

import { Spin, Tree, Modal, TreeSelect, Input } from "antd";
import _ from "lodash";
import Swal from "sweetalert2";

const Menu = () => {
  const { state, dispatch, message } = useMenuContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.getMenuList()
      .then((res) => {
        var result = [];
        _.map(res, (item) => {
          result.push({
            ...item,
            key: item.id,
            id: item.id,
            pId: item.parentid,
            value: item.id,
            title: item.menuname,
          });
        });
        dispatch({ type: "LIST", data: result });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Цэсний жасгаалтын мэдээлэл татаж чадсангүй",
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

  useEffect(() => {
    var result = [];
    _.map(state.list, (item) => {
      result.push({
        ...item,
        key: item.id,
        id: item.id,
        pId: item.parentid,
        value: item.id,
        title: item.menuname,
      });
    });
    dispatch({ type: "LIST_PARENT", data: result });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list]);

  const updateItem = (item) => {
    API.getMenu(item.id)
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
        API.deleteMenu(item.id)
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
        parentid: state.parentid ? state.parentid : 0,
        menuname: state.name,
        route: state.route ? state.route : "",
        isactive: 1,
      };

      if (state.id === null) {
        API.postMenu(data)
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
              title: "Цэс бүртгэж чадсангүй",
            });
          });
      } else {
        API.putMenu(state.id, data)
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
              title: "Цэс засварлаж чадсангүй",
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
            <span className="block font-semibold">Эх цэс:</span>
            <div className="mt-1">
              <TreeSelect
                showSearch
                allowClear={true}
                className="w-full"
                placeholder="Сонгоно уу"
                treeDataSimpleMode={true}
                treeData={state.list_parent}
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
            <span className="font-semibold">Хаяг:</span>
            <div className="mt-1">
              <Input
                className=""
                value={state.route}
                onChange={(e) =>
                  dispatch({
                    type: "ROUTE",
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
          onClick={() => save()}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>

      <Spin spinning={loading} tip="Боловсруулж байна...">
        <div className="border-b p-3">
          <span className="font-semibold">Цэс</span>
        </div>
        <div className="flex flex-col p-3">
          <div className="w-full">
            <button
              className="px-5 py-1 flex items-center justify-center font-semibold text-primary border-2 border-primary rounded-md hover:bg-primary hover:text-white focus:outline-none duration-300 text-xs"
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

          <div className="w-full mt-5">
            <Tree
              selectable={true}
              showLine={{ showLeafIcon: false }}
              showIcon={false}
              treeData={utils.tree_menu(state.list)}
              titleRender={(data) => {
                return (
                  <div className="w-full px-3 py-1 flex items-center justify-between text-xs border rounded-md">
                    <div className="flex-1">{data.menuname}</div>
                    <div className="flex-1">{data.route}</div>
                    <div className="flex-1 flex items-center justify-end gap-2">
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
      </Spin>
    </>
  );
};

export default React.memo(Menu);
