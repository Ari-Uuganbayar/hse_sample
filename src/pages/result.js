import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as API from "src/api/request";

import { notification } from "antd";
import moment from "moment";
import _ from "lodash";

const Result = () => {
  const params = useParams();
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState(null);
  console.log("data: ", data);

  useEffect(() => {
    if (params?.qr) {
      API.getLocationResultByQR(params.qr)
        .then((res) => {
          setData(res);
        })
        .catch((error) => {
          setData(null);
          api.error({
            message: "Хэмжилтийн үр дүн татаж чадсангүй",
            description:
              error.toJSON().status +
              " - " +
              (error?.response?.data?.message
                ? error?.response?.data?.message
                : error.toJSON().message),
            placement: "topRight",
            duration: 5,
          });
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.qr]);

  return (
    <div className="w-full h-screen p-3 bg-gray-200">
      {contextHolder}
      <div className="sm:w-[480px] mb-5 p-3 flex flex-col gap-2 bg-primary text-white border rounded shadow">
        <div className="flex items-center gap-2">
          <span className="w-2/5">Хэмжилтийн огноо: </span>
          <span className="w-3/5 font-semibold border-b">
            {moment(data?.begindate).format("YYYY.MM.DD")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2/5">Байгууллага: </span>
          <span className="w-3/5 font-semibold border-b">
            {data?.parentname ? data?.parentname + "-" : ""}
            {data?.organizationname}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2/5">Байршлын нэр: </span>
          <span className="w-3/5 font-semibold border-b">
            {data?.locationname}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2/5">Байршлын код: </span>
          <span className="w-3/5 font-semibold border-b">
            {data?.locationcode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2/5">Ижил өртөлтийн бүлэг: </span>
          <span className="w-3/5 font-semibold border-b">
            {data?.conditionname}
          </span>
        </div>
      </div>

      <div className="p-3 bg-white border rounded-md shadow">
        <div className="text-center uppercase font-semibold text-lg border-b mb-2 pb-2">
          Үр дүн
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-3">
          {_.map(
            _.filter(data?.parameter, (a) => a.result !== null),
            (item) => {
              console.log("item: ", item);
              return (
                <div
                  key={item.id}
                  className="w-52 h-32 p-4 bg-primary text-white font-semibold border rounded shadow"
                >
                  <div className="flex items-center">
                    <div className="w-2/3">
                      <span>{item.parametername}</span>
                      <span className="ml-2">({item.parameterchar})</span>
                    </div>
                    <div className="w-1/3"></div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
