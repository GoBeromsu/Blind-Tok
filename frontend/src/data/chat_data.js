let chat_datas = [
    {
        id: 1,
        room_id: 1,
        chat_data: [{
            num : 1,
            user_id : "choichoichoi",
            user_nickname : "최승주",
            time : "00-00-00",
            data : "안녕하세요",
        }],
    },
];

export function getChatData(id) {
    return chat_datas.find((chat_data) => chat_data.room_id === id);
}