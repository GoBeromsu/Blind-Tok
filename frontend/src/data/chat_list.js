let chat_rooms = [{
        id: 1,
        room_id: 1,
        room_name: "모임1",
        member: ["gogogo", "choochoochoo", "choichoichoi"],
    },
    {
        id: 2,
        room_id: 2,
        room_name: "모임2",
        member: ["choichoichoi"],
    },
    {
        id: 3,
        room_id: 3,
        room_name: "모임3",
        member: ["choichoichoi"],
    },
];

//movies 전체 데이터 조회
export function getChatingRooms() {
    return chat_rooms;
}

export function getChatingRoom(id) {
    return chat_rooms.find((chat_room) => chat_room.id === id);
}

export function getChat_list(user_id) {
    return chat_rooms.filter((chat_room) => chat_room.member.find((member) => member === user_id) !== null)
}