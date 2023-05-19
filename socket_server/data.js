var data =[]

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
    if(data.find((data)=> data.room_id === room_id))return;
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

export function getData_D(){
    return data;
}
export function setData_D(data_r){
    data = data_r;
}

// test
export function show_d(){ 
    console.log("data : ");
    console.log(data)
}