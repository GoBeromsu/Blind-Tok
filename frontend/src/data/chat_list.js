var chat_list = [{}];

export function setChatList(data){
    chat_list = data;
}

export function getChat_list(){
    console.log(chat_list);
    return chat_list;
}