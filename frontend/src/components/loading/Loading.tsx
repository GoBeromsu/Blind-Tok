import ReactLoading from "react-loading";

export default function Loading() {
  // 이미 있으면 안그리기... 처리 해야함 나중에
  return (
    <div>
      <ReactLoading type="spin" color="#A593E0" />
    </div>
  );
}
