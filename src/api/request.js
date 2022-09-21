import axios from "axios";
import _ from "lodash";
import Swal from "sweetalert2";

export function API() {
  const headers = {
    "Content-Type": "application/json,",
  };
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token != null) {
    Object.assign(headers, {
      Authorization: "Bearer " + token,
    });
  }
  const api = axios.create({
    baseURL: "http://16.163.55.103/api/safetyjob",
    timeout: 200000,
    headers,
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error === undefined || error.response === undefined) {
        Swal.fire({
          title: "Сервистэй холбогдсонгүй.",
          icon: "error",
          // timer: 3000,
        });
      } else {
        if (error.response.status === 401) {
          localStorage.removeItem("token");
          // window.location.replace("/");
        }
      }
      throw error;
    }
  );
  return api;
}

export async function logIn(params) {
  const response = await API().post("/user/login", { ...params });
  return response;
}

export async function logOut() {
  const response = await API().delete("/user/logout");
  return response;
}

export async function getUserInfo() {
  const response = await API().get("/user/info");
  return response.data;
}
export async function getUserMenu() {
  const response = await API().get("/user/menu");
  return response.data;
}

export async function getMenuList() {
  const response = await API().get("/admin/menu");
  return response.data;
}
export async function getMenu(id) {
  const response = await API().get("/admin/menu/" + id);
  return response.data;
}
export async function postMenu(params) {
  const response = await API().post("/admin/menu", { ...params });
  return response.data;
}
export async function putMenu(id, params) {
  const response = await API().post("/admin/menu/" + id, { ...params });
  return response.data;
}
export async function deleteMenu(id) {
  const response = await API().delete("/admin/menu/" + id);
  return response.data;
}

export async function getRoleList() {
  const response = await API().get("/admin/role");
  return response.data;
}
export async function getRole(id) {
  const response = await API().get("/admin/role/" + id);
  return response.data;
}
export async function postRole(params) {
  const response = await API().post("/admin/role", { ...params });
  return response.data;
}
export async function putRole(id, params) {
  const response = await API().post("/admin/role/" + id, { ...params });
  return response.data;
}
export async function deleteRole(id) {
  const response = await API().delete("/admin/role/" + id);
  return response.data;
}

export async function getPermissionList() {
  const response = await API().get("/admin/perm");
  return response.data;
}
export async function getPermission(id) {
  const response = await API().get("/admin/perm/" + id);
  return response.data;
}
export async function postPermission(params) {
  const response = await API().post("/admin/perm", { ...params });
  return response.data;
}
export async function putPermission(id, params) {
  const response = await API().post("/admin/perm/" + id, { ...params });
  return response.data;
}
export async function deletePermission(id) {
  const response = await API().delete("/admin/perm/" + id);
  return response.data;
}

export async function getDepartmentsCustom(parentdept) {
  const response = await API().get("/general/departments/custom", {
    params: {
      parentdept: parentdept,
    },
  });
  return response.data;
}

export async function getOrganizationList() {
  const response = await API().get("/organization");
  return response.data;
}
export async function getOrganization(id) {
  const response = await API().get("/organization/" + id);
  return response.data;
}

export async function postOrganization(params) {
  const response = await API().post("/organization", {
    ...params,
  });
  return response.data;
}

export async function putOrganization(id, params) {
  const response = await API().post("/organization/" + id, {
    organizationname: params.organizationname,
    description: params.description,
  });
  return response.data;
}

export async function deleteOrganization(id) {
  const response = await API().delete("/organization/" + id);
  return response.data;
}

export async function getLocationList(organizationType) {
  const response = await API().get("/location", {
    params: {
      orgtype: organizationType,
    },
  });
  return response.data;
}

export async function getLocation(id) {
  const response = await API().get("/location/" + id);
  return response.data;
}

export async function postLocation(params) {
  const response = await API().post("/location", {
    rorganizationtypeid: params.organizationtype,
    organizationid: params.organizationid,
    tsehcode: params.tsehcode,
    negjcode: params.negjcode,
    locationcode: params.locationcode,
    locationname: params.locationname,
    description: params.description,
  });
  return response.data;
}

export async function putLocation(id, params) {
  const response = await API().post("/location/" + id, {
    rorganizationtypeid: params.organizationtype,
    organizationid: params.organizationid,
    tsehcode: params.tsehcode,
    negjcode: params.negjcode,
    locationcode: params.locationcode,
    locationname: params.locationname,
    description: params.description,
  });
  return response.data;
}

export async function deleteLocation(id) {
  const response = await API().delete("/location/" + id);
  return response.data;
}

export async function getConditionList() {
  const response = await API().get("/condition");
  return response.data;
}

export async function postCondition(params) {
  const response = await API().post("/condition", {
    conditionname: params.conditionname,
  });
  return response.data;
}

export async function putCondition(id, params) {
  const response = await API().post("/condition/" + id, {
    conditionname: params.conditionname,
  });
  return response.data;
}

export async function deleteCondition(id) {
  const response = await API().delete("/condition/" + id);
  return response.data;
}

export async function getSignatureTypeList() {
  const response = await API().get("/signaturetype");
  return response.data;
}

export async function postSignatureType(params) {
  const response = await API().post("/signaturetype", {
    typename: params.typename,
  });
  return response.data;
}

export async function putSignatureType(id, params) {
  const response = await API().post("/signaturetype/" + id, {
    typename: params.typename,
  });
  return response.data;
}

export async function deleteSignatureType(id) {
  const response = await API().delete("/signaturetype/" + id);
  return response.data;
}

export async function getParameterTypeList() {
  const response = await API().get("/rparametertype");
  return response.data;
}

export async function postParameterType(params) {
  const response = await API().post("/rparametertype", {
    typename: params.typename,
  });
  return response.data;
}

export async function putParameterType(id, params) {
  const response = await API().post("/rparametertype/" + id, {
    typename: params.typename,
  });
  return response.data;
}

export async function deleteParameterType(id) {
  const response = await API().delete("/rparametertype/" + id);
  return response.data;
}

export async function getParameterList() {
  const response = await API().get("/parameter");
  return response.data;
}

export async function postParameter(params) {
  const response = await API().post("/parameter", {
    rparametertypeid: _.toString(params.rparametertypeid),
    parametername: params.parametername,
    parameterchar: params.parameterchar,
    standart: params.standart,
    unitname: params.unitname,
    maxvalue8: params.maxvalue8,
    maxvalue12: params.maxvalue12,
  });
  return response.data;
}

export async function putParameter(id, params) {
  const response = await API().post("/parameter/" + id, {
    rparametertypeid: _.toString(params.rparametertypeid),
    parametername: params.parametername,
    parameterchar: params.parameterchar,
    standart: params.standart,
    unitname: params.unitname,
    maxvalue8: params.maxvalue8,
    maxvalue12: params.maxvalue12,
  });
  return response.data;
}

export async function deleteParameter(id) {
  const response = await API().delete("/parameter/" + id);
  return response.data;
}

export async function getSampleList(params) {
  const response = await API().get("/samplework", {
    params: {
      startdate: params.startdate,
      enddate: params.enddate,
    },
  });
  return response.data;
}

export async function postSampleResult(params) {
  const response = await API().post("/sampleworkresult", {
    ...params,
  });
  return response.data;
}
