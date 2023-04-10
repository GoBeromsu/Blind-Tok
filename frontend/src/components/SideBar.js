import React ,{useState} from 'react';
import Button from './Button';
import C_Image from './CircularImage';
import image from '../image/l.png';
import './style/SideBar.css';

const SideBar = ({ }) => {
    const [isOpen, setIsOpen] = useState(true);
    const handleClick = () => {
        alert('Button clicked!');
    };
    const sideOnOff = () =>{
        isOpen === true? setIsOpen(false):setIsOpen(true);
    }
    return (
        <div className="test">
        <div className="sidebar_main">
            <p>
                <h3>아담 : 블라인드 챗</h3>
                <hr />
            </p>
            <C_Image src={image} alt="프로필 이미지" size="130" />
            <br />
            <div className="item">
                <Button onClick={handleClick} label="친구 목록" /><br />
            </div>
            <br/><br/>
            <div className="item">
                <Button onClick={handleClick} label="검색" />
            </div>
            <div className="item">
                <Button onClick={handleClick} label="채팅" /><br />
            </div>
            <div className="item">
                <Button onClick={handleClick} label="알림" /><br />
            </div>
            <div className="item">
                <Button onClick={handleClick} label="설정" /><br />
            </div>
            <div className="item">
                <Button onClick={handleClick} label="로그아웃" /><br />
            </div>
            <br/>
            <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
                <Button onClick={sideOnOff} label="trigger" />
            </div>
            </div>
        </div>
    );
}

export default SideBar;