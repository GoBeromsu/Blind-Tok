var data =[]

export function newUser(user_id){
    let data_n = {
        user_id : user_id,
        room_list : [],
    }
    data = [...data, data_n];
}

export function updateRoomList(room_id, user_list){
    if(user_list === []) return ;
    console.log(user_list);
    for(let i = 0; i < user_list.length; i++){
        let index = data.findIndex((data) => data.user_id === user_list[i].user_id);
        if(index == -1){ newUser(user_list[i].user_id); index = data.length-1; }
        let tmp = data[index];
        data[index] = {user_id : tmp.user_id, room_list : [{room_id: room_id}, ...tmp.room_list]};
        
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

export function getData_U(){
    return data;
}
export function setData_U(data_r){
    data = data_r;
}

// test
export function show_u(){ 
    console.log("user_roomList : ");
    console.log(data)
}