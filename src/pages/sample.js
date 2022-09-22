import React, { useState, useEffect, useLayoutEffect } from "react";
import { useSampleContext } from "src/contexts/sampleContext";
import * as API from "src/api/request";

import { Spin } from "antd";
import _ from "lodash";
import moment from "moment";

var bg_value = [
  "bg-cyan-200",
  "bg-green-200",
  "bg-amber-200",
  "bg-lime-200",
  "bg-indigo-200",
  "bg-fuchsia-200",
  "bg-teal-200",
  "bg-violet-200",
  "bg-cyan-200",
  "bg-green-200",
  "bg-amber-200",
  "bg-lime-200",
  "bg-indigo-200",
  "bg-fuchsia-200",
  "bg-teal-200",
  "bg-violet-200",
];

const Sample = () => {
  const { state, dispatch, type } = useSampleContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);

  useLayoutEffect(() => {
    API.getParameterList()
      .then((res) => {
        dispatch({ type: type.CHANGE_LIST_PARAMETER, data: res });
      })
      .catch(() => dispatch({ type: type.CHANGE_LIST_PARAMETER, data: [] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    API.getSampleList({ startdate: "20210101", enddate: "20221231" })
      .then((res) => dispatch({ type: type.CHANGE_LIST, data: res }))
      .catch(() => dispatch({ type: type.CHANGE_LIST, data: [] }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    var result = state.list;

    if (search !== "") {
      result = _.filter(
        result,
        (a) =>
          _.toLower(a.tsehname).includes(_.toLower(search)) ||
          _.toLower(a.negjname).includes(_.toLower(search))
      );
    }
    setList(result);
  }, [state.list, search]);

  const change_value = (e) => {
    console.log("e: ", e);
  };

  const save = (item) => {
    API.postSampleResult().then((res) => {
      console.log("res: ", res);
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white text-xs border rounded-lg shadow">
      <div className="border-b p-3">
        <span className="text-md font-semibold">"Хэмжилт"</span>
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
          <input
            type="text"
            placeholder="Хайх..."
            className="w-1/2 lg:w-1/3 px-4 py-1 border rounded-md focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
          <div className="text-[10px] overflow-auto">
            <table className="w-full whitespace-nowrap border">
              <thead className="font-thin">
                <tr>
                  <th rowSpan={2} className="w-10 p-1 text-center border">
                    №
                  </th>
                  <th
                    colSpan={2}
                    rowSpan={2}
                    className="p-1 text-center border"
                  >
                    Байгууллага
                  </th>
                  <th rowSpan={2} className="p-1 text-center border">
                    Ажлын байр
                  </th>
                  <th rowSpan={2} className="px-5 py-1 text-center border">
                    Огноо
                  </th>
                  {_.map(
                    Object.entries(
                      _.groupBy(
                        _.orderBy(
                          state.listParameter,
                          ["rparametertypeid"],
                          ["asc"]
                        ),
                        "rparametertypeid"
                      )
                    ),
                    (item, index) => {
                      var rparametertypeid = _.parseInt(item[0]);
                      var parameterType = _.find(state.listParameter, {
                        rparametertypeid: rparametertypeid,
                      });
                      return (
                        <th
                          key={index}
                          colSpan={item[1].length}
                          className={
                            "p-1 text-center border " + bg_value[index]
                          }
                        >
                          {parameterType.parametertypename}
                        </th>
                      );
                    }
                  )}
                </tr>
                <tr>
                  {_.map(
                    Object.entries(
                      _.groupBy(
                        _.orderBy(state.listParameter, [
                          "rparametertypeid",
                          ["asc"],
                        ]),
                        "rparametertypeid"
                      )
                    ),
                    (group, index) => {
                      var result = [];
                      var listGroupedParameter = group[1];
                      _.map(listGroupedParameter, (item) => {
                        result.push(
                          <th
                            key={item.id}
                            className={
                              "px-2 text-center border " + bg_value[index]
                            }
                          >
                            {item.parameterchar !== null
                              ? item.parameterchar
                              : item.parametername}
                          </th>
                        );
                      });
                      return result;
                    }
                  )}
                </tr>
              </thead>
              <tbody>
                {_.map(list, (item, index) => {
                  return (
                    <tr key={item.id} className="hover:bg-gray-200">
                      <td className="p-1 text-center border">{index + 1}</td>
                      <td className="px-3 py-1 border">{item.parentname}</td>
                      <td className="px-3 py-1 border">
                        {item.organizationname}
                      </td>
                      <td className="px-3 py-1 border">{item.locationname}</td>
                      <td className="p-1 text-center border">
                        {moment(item.begindate).format("YYYY.MM.DD")}
                      </td>
                      {_.map(
                        Object.entries(
                          _.groupBy(
                            _.orderBy(
                              state.listParameter,
                              ["rparametertypeid"],
                              ["asc"]
                            ),
                            "rparametertypeid"
                          )
                        ),
                        (group) => {
                          var result = [];
                          var group_list = group[1];
                          _.map(group_list, (a) => {
                            var itemParameter = _.find(
                              item.parameter,
                              (b) => b.id === a.id
                            );
                            result.push(
                              <td key={a.id} className="p-1 text-center border">
                                <input
                                  type="text"
                                  className="w-8 text-center border"
                                  value={
                                    itemParameter?.result === null
                                      ? ""
                                      : itemParameter?.result
                                  }
                                  onChange={(e) => change_value(e)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      save(item.id);
                                    }
                                  }}
                                />
                              </td>
                            );
                          });
                          return result;
                        }
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default React.memo(Sample);
