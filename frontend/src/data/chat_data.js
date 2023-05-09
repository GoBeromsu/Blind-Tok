import React, { useState, useEffect } from 'react';
/*
my Arr[
    {
        room_id: 1,
        data: [{
            num : 1,
            user_id : "choichoichoi",
            user_nickname : "최승주",
            time : "00-00-00",
            data_s : "안녕하세요.안녕하세요.안녕하세요.안녕하세요.안녕하세요.안녕하세요.안녕하세요.안녕하세요.",
        }],
    },
]
*/
function getData(key, id = 0){
    let myArr = localStorage.getItem(key);
    let today = new Date(); 
    let year = today.getFullYear();
    let month = today.getMonth()+1;
    let date = today.getDate();
    let day = "일"; 
    switch (today.getDay()){
        case 0 : break;
        case 1 : day = "월"; break;
        case 2 : day = "화"; break;
        case 3 : day = "수"; break;
        case 4 : day = "목"; break;
        case 5 : day = "금"; break;
        case 6 : day = "토"; break; 
    }

    if(myArr == null){  
        myArr = [{
            room_id: id,
            data: [{
                num : 0,
                user_id : "",
                user_nickname : "",
                time : "",
                data_s : `${year}년 ${month}월 ${date}일 ${day}요일`,
            }],
        },];
        updateData("chatData", myArr);
    }else{
        myArr = JSON.parse(myArr);
    }

    if(myArr.find((p) => p.room_id === id) === undefined){
        myArr = [...myArr, {
            room_id: id,
            data: [{
                num : 0,
                user_id : "",
                user_nickname : "",
                time : "",
                data_s : `${year}년 ${month}월 ${date}일 ${day}요일`,
            }],
        },];
        updateData("chatData", myArr);
    }
    return myArr;
}

function updateData(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}

export function getChatData(id) {
    let tmp = getData("chatData", id);
    return tmp.find((chat_data) => chat_data.room_id === id);
}

export function updateChatData(chat_d) {
    let tmp = getData("chatData");
    let tmp1 = tmp.map((chat_data) => 
        chat_data.room_id === chat_d.room_id
        ? chat_d : chat_data );
    updateData("chatData", tmp1);
}