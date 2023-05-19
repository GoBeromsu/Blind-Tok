import React, { useState, useEffect } from 'react';

interface ChatMessage {
    num: number;
    user_id: string;
    user_nickname: string;
    time: string;
    data_s: string;
}

interface ChatData {
    room_id: number;
    data: ChatMessage[];
}

// localStorage에서 데이터 가져오기
function getData(key: string): ChatData[] | null {
    const myArr = localStorage.getItem(key);
    return myArr ? JSON.parse(myArr) : null;
}

// 데이터 수정 및 저장 / 단일 데이터
export function rec (data: ChatData): ChatData {
    const {room_id, data: newData} = data;
    const tmp = getData("chatData");
    if (!tmp) {
        updateData("chatData", [{room_id: room_id, data: newData}]);
    } else {
        let tmp_f = tmp.find((chatData) => chatData.room_id === room_id);
        if (!tmp_f) {
            tmp.push({room_id, data: newData});
        } else {
            tmp_f.data.push(...newData);
        }
        updateData("chatData", tmp);
    }
    return data;
}

// localStorage에 데이터 저장 
function updateData(key: string, data: ChatData[]): void {
    localStorage.setItem(key, JSON.stringify(data));
}

// 여러 데이터 저장
export function updateData_s(data: ChatData): void {
    const {room_id, data: newData} = data;
    const tmp = getData("chatData");
    if (!tmp) {
        updateData("chatData", [data]);
    } else {
        let tmp_f = tmp.find((chatData) => chatData.room_id === room_id);
        if (!tmp_f) {
            tmp.push(data);
        } else {
            tmp_f.data.push(...newData);
        }
        updateData("chatData", tmp);
    }
}

export function getChatData(id: number): ChatData {
    const tmp = getData("chatData");
    const today = new Date(); 
    const year = today.getFullYear();
    const month = today.getMonth()+1;
    const date = today.getDate();
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
    const data: ChatMessage = {
        num : 0,
        user_id : "",
        user_nickname : "",
        time : "",
        data_s : `${year}년 ${month}월 ${date}일 ${day}요일`,
    }

    if(!tmp){
        return {room_id: id, data: [data]};
    }

    let tmp_f = tmp.find((chatData) => chatData.room_id === id);
    if (!tmp_f) {
        return {room_id: id, data: [data]};
    } else {
        return tmp_f;
    }
}











/*
import React, { useState, useEffect } from 'react';

interface ChatData {
    room_id: number;
    data: {
        num: number;
        user_id: string;
        user_nickname: string;
        time: string;
        data_s: string;
    }[];
}

// localStorage에서 데이터 가져오기
function getData(key: string): ChatData[] | null {
    let myArr = localStorage.getItem(key);
    return myArr ? JSON.parse(myArr) : null;
}

// 데이터 수정 및 저장 / 단일 데이터
export function rec (data: ChatData): ChatData {
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

// localStorage에 데이터 저장 
function updateData(key: string, data: ChatData[]): void {
    localStorage.setItem(key, JSON.stringify(data));
}

// 여러 데이터 저장
export function updateData_s(data: ChatData): void {
    let {room_id, ...rest} = data;
    let tmp = getData("chatData");
    if(!tmp) {
        updateData("chatData", [data]);
    }else{
        let tmp_f = tmp.find((p) => p.room_id === room_id);
        let temp;
        if(!tmp_f){
            console.log(data);
            temp = [...tmp, data];
        }else{
            temp = tmp.map((chat_data) => 
            chat_data.room_id === room_id
            ? {room_id : room_id, data : [...tmp_f.data, ...rest]} : chat_data );
        }
        console.log(temp);
        updateData("chatData", temp);
    }
}

export function getChatData(id: number): ChatData {
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
*/