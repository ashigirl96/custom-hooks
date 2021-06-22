import { VFC } from "react";
import axios, { AxiosRequestConfig } from "axios";
import useSWR from "swr";
import { User } from "../interfaces";


export const axiosInstance = axios.create({
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

function request<ResponseBody = unknown>(object: AxiosRequestConfig) {
  return axiosInstance.request<ResponseBody>(object);
}

function getUsersShow(id: string) {
  return request<User>({
    method: "GET",
    url: `/api/users/${id}`
  })
}

function useUser(id: number) {
  const { data, error } = useSWR([id], getUsersShow);

  return {
    user: data?.data,
    isLoading: !error && !data,
    isError: error,
    message: error?.message
  };
}

type Props = {};
const Index: VFC<Props> = ({}) => {
  const id = 1010;

  const { user, isLoading, isError, message } = useUser(id);

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
    </div>
  );
};

export default Index;