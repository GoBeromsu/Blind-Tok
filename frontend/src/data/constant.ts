export const options = {
  refetchOnWindowFocus: false,
  retry: 0,
  onSuccess: result => {
    //api 호출 성공
    console.log("onSuccess >>", result?.data);
  },
  onError: error => {
    //api 호출 실패
    console.log("onError >> ", error.message);
  },
};
