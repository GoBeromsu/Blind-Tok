var data = [
    {
        room_id : 1,
        room_data :[{
            num : 1,
            user_id : "choichoichoi",
            user_nickname : "최승주",
            time : "00-00-00",
            data_s : "안녕하세요.안녕하세요.안녕하세요.",
        }]
    },
    {
        room_id : 2,
        room_data :[{
            num : 1,
            user_id : "choichoichoi",
            user_nickname : "최승주",
            time : "00-00-00",
            data_s : "안녕하세요.안녕하세요.안녕하세요.",
        }]
    },
    {
        room_id : 3,
        room_data :[{
            num : 1,
            user_id : "choichoichoi",
            user_nickname : "최승주",
            time : "00-00-00",
            data_s : "안녕하세요.안녕하세요.안녕하세요.",
        }]
    },

];

export function getData(room_id, data_num, opt){
    let index = data.findIndex((data) => data.room_id === room_id);
    let data_t;
    if( opt == 1){
        data_t = data[index].room_data;
        data[index].room_data = data_t.filter((data)=> data.num <= data_num);
    }else{
        data_t = data[index].room_data.filter((data)=> data.num > data_num);
    }
    console.log("getData");
    return data_t;
}

export function createData(room_id){
    let data_n = {room_id : room_id, room_data : []};
    data = [...data, data_n];
    console.log("createData : ");
    console.log(data)
}

export function setData(room_id, data_t){
    let index = data.findIndex((data) => data.room_id === room_id);
    if(index === -1) {
        createData(room_id);
        index = data.length - 1;
    }
    let room_data_n = data.at(index).room_data;
    data[index] = {room_id: room_id, room_data: [...room_data_n, data_t]};
    console.log("setData : ");
    console.log(data)
};

export function saveLocal(){

}

// test
export function show_d(){ 
    console.log("data : ");
    console.log(data)
}