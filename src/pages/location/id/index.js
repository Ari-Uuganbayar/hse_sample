import React, { useEffect, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocationContext } from "src/contexts/locationContext";
import * as API from "src/api/request";

import { Select, Input } from "antd";
import _ from "lodash";
import Swal from "sweetalert2";
const { Option } = Select;
const { TextArea } = Input;

const Index = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch, type } = useLocationContext();

  useLayoutEffect(() => {
    API.getDepartmentsCustom(null).then((res) =>
      dispatch({ type: type.CHANGE_DETAIL_LIST_TSEH, data: res })
    );

    API.getOrganizationList().then((res) =>
      dispatch({ type: type.CHANGE_DETAIL_LIST_ORGANIZATION, data: res })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id === "add") dispatch({ type: type.CLEAR_DETAIL });
    else {
      API.getLocation(id).then((res) => {
        dispatch({ type: type.CHANGE_DETAL, data: res });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (state.detail.selectedTseh !== null)
      API.getDepartmentsCustom(state.detail.selectedTseh).then((res) =>
        dispatch({ type: type.CHANGE_DETAIL_LIST_NEGJ, data: res })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.detail.selectedTseh]);

  const save = () => {
    var error = "";
    if (state.detail.selectedTseh === null) error += "Цех <br/>";
    if (state.detail.selectedNegj === null) error += "Нэгж <br/>";
    if (state.detail.locationCode === null) error += "Байршлын код <br/>";
    if (state.detail.locationName === null) error += "Байршлын нэр <br/>";

    if (error !== "") {
      Swal.fire({
        icon: "warning",
        title: "<b class='text-red-400'>*</b> талбарыг бөглөнө үү.",
        html: error,
      });
    } else {
      var data = {
        organizationtype: state.detail.selectedOrgType,
        organizationid:
          state.detail.selectedOrganization === null
            ? 0
            : state.detail.selectedOrganization,
        tsehcode: state.detail.selectedTseh,
        negjcode: state.detail.selectedNegj,
        locationcode: state.detail.locationCode,
        locationname: state.detail.locationName,
        description:
          state.detail.description === null ? "" : state.detail.description,
      };

      if (id === "add") {
        API.postLocation(data).then(() => {
          Swal.fire({
            icon: "success",
            title: "Амжилттай хадгалагдлаа.",
            timer: 1000,
          });
          navigate("/location");
        });
      } else {
        API.putLocation(id, data).then(() => {
          Swal.fire({
            icon: "success",
            title: "Амжилттай хадгалагдлаа.",
            timer: 1000,
          });
          navigate("/location");
        });
      }
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow">
      <div className="border-b p-3">
        <div
          className="w-10 h-8 flex items-center justify-center bg-primary_blue hover:bg-opacity-90 duration-300 text-white text-2xl border rounded-md cursor-pointer"
          onClick={() => navigate("/location")}
        >
          <ion-icon name="arrow-back-outline" />
        </div>
      </div>
      <div className="h-[calc(100vh-115px)] px-3 py-3 overflow-auto">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
            <span className="lg:w-1/4 flex items-center">
              Байгууллагын төрөл: <b className="ml-1 text-red-500">*</b>
            </span>
            <div className="lg:w-3/4 flex items-center">
              <Select
                showSearch
                className="w-full"
                placeholder="Сонгоно уу."
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                value={state.detail.selectedOrgType}
                onChange={(value) =>
                  dispatch({
                    type: type.CHANGE_DETAIL_SELECTED_ORG_TYPE,
                    data: value,
                  })
                }
              >
                {_.map(state.listOrgType, (item) => (
                  <Option key={item.id} value={item.id}>
                    <div className="">{item.text}</div>
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {state.detail.selectedOrgType === 2 && (
            <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
              <span className="lg:w-1/4 flex items-center">
                Байгууллага: <b className="ml-1 text-red-500">*</b>
              </span>
              <div className="lg:w-3/4 flex items-center">
                <Select
                  showSearch
                  className="w-full"
                  placeholder="Сонгоно уу."
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  value={state.detail.selectedOrganization}
                  onChange={(value) =>
                    dispatch({
                      type: type.CHANGE_DETAIL_SELECTED_ORGANIZATION,
                      data: value,
                    })
                  }
                >
                  {_.map(state.detail.listOrganization, (item) => (
                    <Option key={item.id} value={item.id}>
                      <div className="">{item.organizationname}</div>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          )}

          {state.detail.selectedOrgType === 1 && (
            <>
              <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
                <span className="lg:w-1/4 flex items-center">
                  Цех: <b className="ml-1 text-red-500">*</b>
                </span>
                <div className="lg:w-3/4 flex items-center">
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Сонгоно уу."
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    value={state.detail.selectedTseh}
                    onChange={(value) =>
                      dispatch({
                        type: type.CHANGE_DETAIL_SELECTED_TSEH,
                        data: value,
                      })
                    }
                  >
                    {_.map(state.detail.listTseh, (item) => (
                      <Option
                        key={item.department_code}
                        value={item.department_code}
                      >
                        <div className="">
                          {item.department_code + " | " + item.name_mon}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
                <span className="lg:w-1/4 flex items-center">
                  Нэгж: <b className="ml-1 text-red-500">*</b>
                </span>
                <div className="lg:w-3/4 flex items-center">
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Сонгоно уу."
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    value={state.detail.selectedNegj}
                    onChange={(value) =>
                      dispatch({
                        type: type.CHANGE_DETAIL_SELECTED_NEGJ,
                        data: value,
                      })
                    }
                  >
                    {_.map(state.detail.listNegj, (item, index) => (
                      <Option key={index} value={item.department_code}>
                        {item.department_code + " | " + item.name_mon}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
            <span className="lg:w-1/4 flex items-center">
              Байршлын код:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="lg:w-3/4 flex items-center">
              <Input
                placeholder="Байршлын код"
                value={state.detail.locationCode}
                onChange={(e) =>
                  dispatch({
                    type: type.CHANGE_DETAIL_LOCATION_CODE,
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
            <span className="lg:w-1/4 flex items-center">
              Байршлын нэр:<b className="ml-1 text-red-500">*</b>
            </span>
            <div className="lg:w-3/4 flex items-center">
              <Input
                placeholder="Байршлын нэр"
                value={state.detail.locationName}
                onChange={(e) =>
                  dispatch({
                    type: type.CHANGE_DETAIL_LOCATION_NAME,
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
            <span className="lg:w-1/4 flex items-center">Тайлбар:</span>
            <div className="lg:w-3/4 flex items-center">
              <TextArea
                rows={4}
                placeholder="Тайлбар"
                value={state.detail.description}
                onChange={(e) =>
                  dispatch({
                    type: type.CHANGE_DETAIL_DESCRIPTION,
                    data: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-2 border-b pb-2">
            <span className="lg:w-1/4 flex items-center"></span>
            <div className="lg:w-3/4 flex items-center">
              <button
                className="w-full py-2 bg-primary_blue hover:bg-opacity-80 text-white font-semibold text-xs border rounded-md shadow duration-300"
                onClick={() => save()}
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Index);
