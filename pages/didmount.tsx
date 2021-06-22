import { useCallback, useState, VFC } from "react";
import { useAsyncOnce } from "../hooks";
import axios, { AxiosRequestConfig } from "axios";
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


type Props = {};
const Component: VFC<Props> = ({}) => {

  const [id1, setId1] = useState(101);
  const id2 = 101;
  const id3 = "hoge";

  const { isLoading, error, result } = useAsyncOnce(
    useCallback(async () => {
      const x = await getUsersShow(id1, { party: true });
      const y = await getUsersShow(id2, { party: false });
      return [x, y];
    }, [id1, id2, id3])
  );

  if (isLoading) {
    return <div>is loading...</div>
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <div>
      <input onInput={(e) => {
        setId1(+e.currentTarget.value)
      }} placeholder="id" value={id1} />
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

export default Component;