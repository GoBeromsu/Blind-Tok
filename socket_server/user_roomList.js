var data = [{
    user_id : "choichoichoi",
    room_list : [
        {room_id:1},
        {room_id:2},
        {room_id:3}
    ]
}];

export function newUser(user_id){
    let data_n = {
        user_id : user_id,
        room_list : [],
    }
    data = [...data, data_n];
}

export function updateRoomList(room_id, userList){
    for(let i = 0; userList.length; i++){
        let index = data.findIndex((data) => data.user_id === userList[i].user_id);
        if(index != -1){
        data[index] = {user_id : user_id, room_list : [{room_id: room_id}, ...data[index].room_list]};
        }else{ console.log("updataRoomList : not User")}
        console.log("updateRoomList : ");
        console.log(data);
    }
}

export function removeRoomList(room_id, user_id){
    let user = data.find((data) => data.user_id === user_id);
    user.room_list = user.room_list.filter((room) => room.room_id != room_id)
    data = data.map((data) => data.user_id === user_id ? user : data);
    console.log("removeRoomList : ");
    console.log(data)
};

export function getUserRoomList(user_id){
    let user = data.find((data) => data.user_id === user_id);
    if(!user){
        newUser(user_id);
        return [];
    }
    return user.room_list;
}

export function saveLocal(){

}

// test
export function show_u(){ 
    console.log("user_roomList : ");
    console.log(data)
}