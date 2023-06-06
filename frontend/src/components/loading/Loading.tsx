import {Box} from "@mui/material";
import ReactLoading from "react-loading";

export default function Loading() {
  // 이미 있으면 안그리기... 처리 해야함 나중에
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.1)",
        zIndex: "20000",
        top: 0,
        left: 0,
      }}>
      <ReactLoading type="spin" color="#A593E0" />
    </Box>
  );
}
