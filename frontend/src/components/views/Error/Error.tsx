import {useNavigate, useLocation} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {Navigate} from "react-router-dom";
import {userState} from "@data/user/state";
import {server} from "@data/constant";
import Loading from "@loading/Loading";

export default function Error({error}: any) {
  const loginUser = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();
  if (Number(error?.response?.status) > 500) {
    if (loginUser) {
      server
        .post("/auth/refreshToken")
        .then(data => {
          if (data?.data == "USER_AUTHENTICATED") {
            navigate(0);
          }
          const {pathname} = location;

          if (pathname) {
          }
        })
        .catch(err => {
          console.log("refreshToken err >", err);
          return <Navigate to="/login" />;
        });
      return <Loading />;
    } else {
      console.error(" loginUser 여기! ", error);
      return <Navigate to="/login" />;
    }
  }
  return (
    <div>
      {error && (
        <div>
          <span>Code : {error?.code}</span>
          <span>
            Error: {error?.response?.status} ({error?.response?.statusText})
          </span>
          <span>Message: {error?.response?.data?.message}</span>
        </div>
      )}
    </div>
  );
}
