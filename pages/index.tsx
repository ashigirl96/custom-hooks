import { useMemo, VFC } from "react";
import axios, { AxiosRequestConfig } from "axios";
import useSWR from "swr";
import { User as OUser } from "../interfaces";


export const axiosInstance = axios.create({
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

function request<ResponseBody = unknown>(object: AxiosRequestConfig) {
  return axiosInstance.request<ResponseBody>(object);
}

interface User extends OUser {
  funny: boolean;
}

interface Params {
  party: boolean;
}

function getUsersShow(id: number, params: Params) {
  return request<User>({
    method: "GET",
    url: `/api/users/${id}`,
    params,
  })
}

function useUser(id: number, params: Params) {
  const { data, error } = useSWR([id, params], getUsersShow);

  return {
    user: data?.data,
    isLoading: !error && !data,
    isError: error,
    message: error?.message
  };
}

type Props = {};
const Index: VFC<Props> = ({}) => {
  const id = 101;
  const params = useMemo(() => ({
    party: false,
  }), []);

  const { user, isLoading, isError, message } = useUser(id, params);

  if (isLoading) {
    return <div>is Loading...</div>
  }

  if (isError) {
    return <div>is Error... {message}</div>
  }


  return (
    <div>
      <div>
        hello ID {user.id} {user.name}
      </div>
      <div>
        funny? {user.funny}
      </div>
    </div>
  );
};

export default Index;