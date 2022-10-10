import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocationContext } from "src/contexts/reference/locationContext";
import * as API from "src/api/request";

import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";

import { Spin, Modal, TreeSelect, Input } from "antd";
import _ from "lodash";
import * as utils from "src/lib/utils";
import Swal from "sweetalert2";
const { TextArea } = Input;

const Location = () => {
  const ref_print = useRef();
  const { state, dispatch, message } = useLocationContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handle_print = useReactToPrint({ content: () => ref_print.current });

  useEffect(() => {
    setLoading(true);
    API.getLocationList(state.orgtype)
      .then((res) => {
        dispatch({ type: "LIST", data: res });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Жасгаалт татаж чадсангүй",
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.orgtype, state.refresh]);

  useEffect(() => {
    API.getOrganizationList()
      .then((res) => {
        var result = [];
        _.map(res, (item) => {
          result.push({
            ...item,
            title: item.organizationname,
            key: item.id,
            value: item.id,
            id: item.id,
            pId: item.parentid,
          });
        });
        dispatch({ type: "LIST_ORGANIZATION", data: result });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Байгууллагын жасгаалт татаж чадсангүй",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tbody = useMemo(() => {
    var list = state.list;
    var count = 0;
    var result = [];

    if (search !== "")
      result = _.filter(
        result,
        (a) =>
          _.toLower(a.parentname).includes(_.toLower(search)) ||
          _.toLower(a.organizationname).includes(_.toLower(search)) ||
          _.toLower(a.locationcode).includes(_.toLower(search)) ||
          _.toLower(a.locationname).includes(_.toLower(search)) ||
          _.toLower(a.description).includes(_.toLower(search))
      );

    list.length === 0 &&
      result.push(
        <tr key="empty">
          <td className="p-1 text-orange-500 border italic" colSpan={7}>
            Мэдээлэл олдсонгүй ...
          </td>
        </tr>
      );

    _.map(Object.entries(_.groupBy(list, "parentname")), (group1, g1_index) => {
      var list1 = group1[1];

      _.map(
        Object.entries(_.groupBy(list1, "organizationname")),
        (group2, g2_index) => {
          var list2 = group2[1];

          _.map(list2, (item, index) => {
            count++;

            result.push(
              <tr key={item.id}>
                <td className="p-1 text-center border">{count}</td>
                {g2_index === 0 && index === 0 && (
                  <td className="p-1 text-center border" rowSpan={list1.length}>
                    {group1[0]}
                  </td>
                )}
                {index === 0 && (
                  <td className="p-1 text-center border" rowSpan={list2.length}>
                    {group2[0]}
                  </td>
                )}
                <td className="p-1 text-center border">{item.locationcode}</td>
                <td className="px-3 py-1 border">{item.locationname}</td>
                <td className="px-3 py-1 border">{item.description}</td>
                <td className="border">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="flex items-center justify-center text-[14px] cursor-pointer"
                      onClick={() => qrItem(item)}
                    >
                      <ion-icon name="qr-code-outline" />
                    </div>
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
          });
        }
      );
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state.list]);

  const updateItem = (item) => {
    API.getLocation(item.id)
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
        API.deleteLocation(item.id)
          .then(() => {
            dispatch({ type: "REFRESH" });
            message({ type: "success", title: "Амжилттай устгагдлаа" });
          })
          .catch((error) => {
            message({ type: "error", error, title: "Устгаж чадсангүй" });
          });
      }
    });
  };

  const save = () => {
    var error = [];
    state.organization || error.push("Байгууллага");
    state.code || error.push("Байршлын код");
    state.name || error.push("Байршлын нэр");

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
        organizationid: state.organization,
        locationcode: state.code,
        locationname: state.name,
        description: state.description,
      };

      if (state.id === null) {
        API.postLocation(data)
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
        API.putLocation(state.id, data)
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

  const qrItem = (item) => {
    API.getLocationQR(item.id)
      .then((res) => {
        var url = "https://safetyjob.tk/samplework/qr/" + res;
        dispatch({ type: "QR_MODAL", data: true });
        dispatch({ type: "QR_PARENT", data: item.parentname });
        dispatch({ type: "QR_ORGANIZATION", data: item.organizationname });
        dispatch({ type: "QR_LOCATION", data: item.locationname });
        dispatch({
          type: "QR_VALUE",
          data: url,
        });
      })
      .catch((error) => {
        dispatch({ type: "QR_PARENT", data: null });
        dispatch({ type: "QR_ORGANIZATION", data: null });
        dispatch({ type: "QR_LOCATION", data: null });
        dispatch({
          type: "QR_VALUE",
          data: null,
        });
        message({
          type: "error",
          error,
          title: "QR татаж чадсангүй",
        });
      });
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
            <span className="block font-semibold">
              Байгууллага:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <TreeSelect
                showSearch
                allowClear={true}
                className="w-full"
                placeholder="Сонгоно уу"
                treeDataSimpleMode={true}
                treeData={utils.tree_menu(
                  _.filter(state.list_organization, {
                    rorganizationtypeid: state.orgtype,
                  })
                )}
                treeLine={(true, { showLeafIcon: false })}
                value={state.organization}
                onChange={(value) =>
                  dispatch({
                    type: "ORGANIZATION",
                    data: value,
                  })
                }
                filterTreeNode={(search, item) => {
                  return (
                    item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0
                  );
                }}
              />
            </div>
          </div>

          <div className="">
            <span className="font-semibold">
              Байршлын код:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="mt-1">
              <Input
                value={state.code}
                onChange={(e) =>
                  dispatch({
                    type: "CODE",
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="">
            <span className="font-semibold">
              Байршлын нэр:<b className="ml-1 text-red-500">*</b>
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
          className="w-full py-1 flex items-center justify-center font-semibold bg-primary text-white border-2 border-primary rounded-md hover:bg-white hover:text-primary focus:outline-none duration-300 text-xs"
          onClick={() => save()}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>

      <Modal
        centered
        width={500}
        title={<div className="text-center">QR Код</div>}
        visible={state.qr_modal}
        onCancel={() => dispatch({ type: "QR_MODAL", data: false })}
        footer={null}
      >
        <div
          ref={ref_print}
          className="mt-5 flex flex-col items-center justify-center"
        >
          <div className="flex items-center justify-center gap-2 font-semibold mb-5">
            <span>{state.qr_parent}</span>
            <span> - {state.qr_organization}</span>
            <span>- {state.qr_location}</span>
          </div>
          <QRCode size={400} value={state.qr_value} />
        </div>

        <div className="my-3 border" />

        <button
          className="w-full py-1 flex items-center justify-center font-semibold bg-primary text-white border-2 border-primary rounded-md hover:bg-white hover:text-primary focus:outline-none duration-300 text-xs"
          onClick={handle_print}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хэвлэх</span>
        </button>
      </Modal>

      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <div className="border-b p-3">
          <span className="font-semibold">Байршил цонх</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-3 p-3 text-xs">
          <div className="sm:w-80 p-3 border rounded-md shadow">
            <h1 className="font-semibold">Шүүлтүүр</h1>
            <hr className="my-3" />

            <i className="-tracking-wider text-primary">Байгууллагын төрөл</i>
            <div className="flex flex-col justify-center gap-2 mt-1">
              {_.map(state.list_orgtype, (item) => {
                return (
                  <div
                    key={item.id}
                    className={
                      "px-3 py-1 font-semibold border rounded-lg cursor-pointer duration-300 " +
                      (state.orgtype === item.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-200")
                    }
                    onClick={() => dispatch({ type: "ORGTYPE", data: item.id })}
                  >
                    {item.text}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="w-full flex items-center justify-between mb-2">
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
              <input
                type="text"
                placeholder="Хайх..."
                className="w-1/2 lg:w-1/3 px-4 py-1 border rounded-md focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative max-h-[calc(100vh-180px)] overflow-auto">
              <table className="w-full text-xs border-separate border-spacing-0">
                <thead className="sticky top-0 bg-white font-semibold z-10">
                  <tr>
                    <th className="w-10 text-center p-1 border">№</th>
                    <th colSpan={2} className="text-center p-1 border">
                      Байгууллага
                    </th>
                    <th className="text-center p-1 border">Байршлын код</th>
                    <th className="text-center p-1 border">Байршлын нэр</th>
                    <th className="text-center p-1 border">Тайлбар</th>
                    <th className="w-20 text-center p-1 border"></th>
                  </tr>
                </thead>
                <tbody>{tbody}</tbody>
              </table>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default React.memo(Location);
