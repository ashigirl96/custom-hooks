import { useMemo, useState, VFC } from "react";
import axios, { AxiosRequestConfig } from "axios";
import useSWR from "swr";
import { User as OUser } from "../interfaces";
import { useAsyncCallback } from "../hooks";


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
  const [id1, setId1] = useState(101);
  const id2 = 102;
  const id3 = "hoge";

  const { isLoading, error, result, executor } = useAsyncCallback(async ([ id1, id2, id3 ]) => {
    const x = await getUsersShow(id1, { party: true });
    const y = await getUsersShow(id2, { party: false });
    return [x, y];
  }, [id1, id2, id3] as const, false);


  if (isLoading) {
    return <div>is Loading...</div>
  }

  if (error) {
    return <div>is Error... {JSON.stringify(error)}</div>
  }


  return (
    <div>
      <input onInput={(e) => {
        setId1(+e.currentTarget.value)
      }} placeholder="id" value={id1} />
      <button onClick={executor}>
        Click
      </button>
      {result && result.map((user) => {
        return (
          <div>
            ID: {user.data.id},
            Name: {user.data.name}
          </div>
        )
      })}
    </div>
  );
};

export default Index;