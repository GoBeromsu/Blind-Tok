﻿import React, { useState, useEffect } from 'react';
/*
my Arr[
    {
        room_id: 1,
        data: [{
            num : 1,
            user_id : "choichoichoi",
            user_nickname : "최승주",
            time : "00-00-00",
            data_s : "안녕하세요.안녕하세요.안녕하세요.",
        }],
    },
]
*/

// 지역저장소에서 데이터 가져오기
function getData(key){
    let myArr = localStorage.getItem(key);
    if(myArr == null){
        //myArr = [];
    }else{
        myArr = JSON.parse(myArr);
    }
    return myArr;
}

// 데이터 수정 및 저장 / 단일 데이터
export function rec (data){
    let {room_id, ...rest} = data;
    let tmp = getData("chatData");
    if(!tmp) {
        updateData("chatData", [{room_id: room_id, data: [rest]}]);
    }else{
        let tmp_f = tmp.find((p) => p.room_id === room_id);
        if(!tmp_f){
            tmp_f = [...tmp,{room_id:room_id, data: [rest]}];
        }else{
            tmp_f = tmp.map((chat_data) => 
            chat_data.room_id === room_id
            ? {...chat_data, data : [...tmp_f.data,rest]} : chat_data );
        }
        updateData("chatData", tmp_f);
    }
    return data;
}

// 지역 저장소에 데이터 저장 
function updateData(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}

// 여러 데이터 저장
export function updateData_s(data){
    let {room_id, ...rest} = data;
    let tmp = getData("chatData");
    if(!tmp) {
        updateData("chatData", [data]);
    }else{
        let tmp_f = tmp.find((p) => p.room_id === room_id);
        if(!tmp_f){
            console.log(data);
            tmp_f = [...tmp, data];
        }else{
            tmp_f = tmp.map((chat_data) => 
            chat_data.room_id === room_id
            ? {room_id : room_id, data : [...tmp_f.data, ...rest]} : chat_data );
        }
        console.log(tmp_f);
        updateData("chatData", tmp_f);
    }
}

export function getChatData(id) {
    let tmp = getData("chatData");
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
    let data = {
        num : 0,
        user_id : "",
        user_nickname : "",
        time : "",
        data_s : `${year}년 ${month}월 ${date}일 ${day}요일`,
    }

    if(!tmp){
        console.log({id, data});
        return {room_id: id, data: [data]};
    }

    let tmp_f = tmp.find((p) => p.room_id === id);
    if(!tmp_f){
        return {room_id: id, data: [data]};
    }else{
        return tmp_f;
    }
}