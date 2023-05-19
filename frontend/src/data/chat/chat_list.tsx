var chat_list = [{}];

export function setChatList(data:any){
    chat_list = data;
    console.log("-----chat_list-----");
    console.log(chat_list);
}

export function getChat_list(){
    return chat_list;
}