import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import {IconButton} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import UploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import {Button, TextField, List, ListItem} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Br from "./Br";
import Modal from "react-modal";
import {Cookies} from "react-cookie";
import {SearchState} from "@data/user/state";
import {useRecoilState} from "recoil";

Modal.setAppElement("#root");

const IconBarOpen = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>([]);
  const [searchAudio, setSearchAudio] = useRecoilState<any>(SearchState);
  let navigate = useNavigate();
  const cookies = new Cookies();
  const handleLogout = () => {
    cookies.remove("access_token", {path: "/", domain: "localhost"});
    navigate("/login");
  };

  const handleChange = (event: {target: {value: React.SetStateAction<string>}}) => {
    setQuery(event.target.value);
  };
  useEffect(() => {
    console.log("searchAudio changed:", searchAudio);
  }, [searchAudio]);

  const handleSubmit = (event: {preventDefault: () => void}) => {
    event.preventDefault();
    console.log(query);
    setSearchAudio(query);
    setSearchResults([query, ...searchResults]);
    setQuery("");
    setModalIsOpen(false);
    navigate("/");
  };

  const removeSearchResult = (index: number) => {
    const updatedResults = [...searchResults];
    updatedResults.splice(index, 1);
    setSearchResults(updatedResults);
  };

  const M_style: any = {
    overlay: {
      backgroundColor: "0, 0, 0, 0.5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },
    content: {
      zIndex: 10,
      position: "fixed",
      top: "30px",
      left: "44.6%",
      //transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      //padding: "20px",
      width: "500px",
      borderRadius: "20px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <>
      <div className="iconbar_open">
        <Link to="/friend">
          <IconButton>
            <PeopleIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Friend List</span>
          </IconButton>
        </Link>
        <Link to="/upload">
          <IconButton>
            <UploadIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; File Upload</span>
          </IconButton>
        </Link>
        <Br />
        <br />
        <IconButton
          style={{paddingRight: "30px"}}
          onClick={() => {
            setModalIsOpen(!modalIsOpen);
          }}>
          <SearchIcon style={{fontSize: 30}} />
          <span style={{fontSize: 14}}>&nbsp;&nbsp; Search</span>
        </IconButton>

        <Link to="/chat">
          <IconButton>
            <ChatIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Chatting</span>
          </IconButton>
        </Link>
        <Br />
        <br />
        <Link to="/notification">
          <IconButton style={{paddingRight: "35px"}}>
            <NotificationsIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Alarm</span>
          </IconButton>
        </Link>
        <Link to="/User">
          <IconButton>
            <SettingsIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Setting</span>
          </IconButton>
        </Link>
        <Br />
        <Br />
        <div className="item" onClick={handleLogout} style={{paddingLeft: "125px"}}>
          <IconButton>
            <LogoutIcon style={{fontSize: 30}} />
            <span style={{fontSize: 14}}>&nbsp;&nbsp; Logout</span>
          </IconButton>
          <Br />
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
        }}
        contentLabel="검색 창"
        className="search-modal"
        overlayClassName="search-modal-overlay"
        style={M_style}>
        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            label="검색어를 입력하세요"
            variant="outlined"
            value={query}
            onChange={handleChange}
            autoFocus
            sx={{
              width: "500px",
              borderRadius: "20px",
              "& fieldset": {
                borderRadius: "20px",
              },
            }}
          />
          {searchResults.length != 0 && (
            <List>
              {searchResults.map((result: any, index: any) => (
                <ListItem key={index}>
                  {result}
                  <IconButton
                    onClick={() => {
                      removeSearchResult(index);
                    }}
                    style={{marginLeft: "auto"}}>
                    <CloseIcon style={{fontSize: 16}} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </form>
      </Modal>
    </>
  );
};

export default IconBarOpen;
