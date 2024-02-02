import { baseUrl } from "../../../helpers/url";

import { useQuery } from "react-query";

const verFeeds = async () => {
  try {
    const resp = await fetch(baseUrl + "user/verFeedbacks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    });

    const data = await resp.json();
    return data;
  } catch (error) {
    return error;
  }
};

function FeedBacks() {
  const getFeeds = useQuery({
    queryKey: ["verFeeds"],
    queryFn: verFeeds,
  });
  console.log(getFeeds);

  if (getFeeds.isLoading) return <h1>Cargando</h1>;
  if (getFeeds.isSuccess && !getFeeds.data) return <h1>Cargando</h1>;
  return (
    <div>
      {getFeeds.data.feedbacks?.map((feed) => (
        <div
          key={feed._id}
          className="mb-2"
          style={{
            border: "1px solid black",
            padding: "5px",
          }}
        >
          <div>
            Usuario : {feed.user.nombre} {feed.user.apellido}
          </div>
          <div>Mensaje: {feed.mensage ? feed.mensage : null}</div>
        </div>
      ))}
    </div>
  );
}

export default FeedBacks;
