import React from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import * as API from "src/api/request";

const SSO = () => {
  const { search } = useLocation();
  let params = queryString.parse(search);

  if (params.error) window.location.replace("https://digital.erdenetmc.mn");
  else {
    API.API()
      .post("/auth", {
        code: params.code,
      })
      .then((res) => {
        if (res.status === 200) {
          window.localStorage.clear();
          // localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "token",
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzc28iLCJhdWQiOiJybHRlZWV2eG90IiwiZXhwIjoxNjY2Nzg4ODE1LCJpYXQiOjE2NjY3MDI0MTUsInRuIjoiNTI4NDciLCJ0eXAiOiJlbXAiLCJzaWQiOiJhcHBfb3duZXIiLCJjaWQiOiJtd2p3am9zeiIsInR0IjoiYWNjZXNzIn0.1aA7GtBj8tQ0bei2k3RgcRESc1dLvQzbhY247QtYtHc3Wtvnp26eFyM1aHNOZaFxZWSBi7gR6TNGVTIHQvlNzyIv8ZfTVrYv0OkuIOuk7zyode_w7UlhAVnlnd86GRuQtQeSX5jm_nL8Wi80R1_HSgMWudlhTq0mbGAtQtZiO52dQJSi7cUacqI1ZpEaNnPlRq1PpYMchwN0h74tiXeT3_bFnIdgd7DmIbkGEiEyJRympeAdSCklYNYW80gUS70Mcq0xie8mad--XjM7ApKrUTnYUTBMN13p9BxVxDz8X4LBrZ9cY8_LF8hY4HRq2HSJ5az-0HU6n9e4M3xoUTov2aIPiVT0FRPg23xvJD3MdU779TqxOsGupKOpeKhhIc-PvviqFB1VokjrUzzf9BQLRM5nldKV4SgsgTpEO3M9B8DkrF7LyVLq4DXCCx9_WuMJ9wszHtxPlcw2En9cvRgIS3M_XP3nVhSLnN3IGGcG26EP5jZj2lkQ0wb5ebFkFV8BdYWfvz7r057csdtx4eSX91JYV86zOoqkcv6i8Wi0uJ3gdxg6oq0lXWgWULTPaKRvv4sYMsjdGN90ueTiiLtsrCcZytgBCkr3ZXALKe41Q8oBsTL33Bc1CiPulr3BSEP7tOUmg5ZEkPXn96N3M3iz2imzXIS_LAi4W-2GHmKUcC8"
          );

          window.location.replace("/");
        }
      });
  }

  return <></>;
};

export default React.memo(SSO);
