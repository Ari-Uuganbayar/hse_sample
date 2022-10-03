import React, { useEffect } from "react";
import * as API from "src/api/request";
import { notification } from "antd";

const Result = () => {
  const [api, contextHolder] = notification.useNotification();
  var url = window.location.pathname.split("/");

  useEffect(() => {
    API.getLocationResultByQR(url[2])
      .then((res) => {
        console.log("res: ", res);
      })
      .catch((error) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-screen p-3 bg-gray-200">
      {contextHolder}
      <div className="h-full p-3 bg-white border rounded-md shadow">Result</div>
    </div>
  );
};

export default Result;
