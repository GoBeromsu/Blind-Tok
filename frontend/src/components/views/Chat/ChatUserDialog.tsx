import * as React from "react";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {TransitionProps} from "@mui/material/transitions";
import {Box, ListItem, ListItemButton} from "@mui/material";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChatUserDialog({
  open,
  setOpen,
  users,
  selectedUser,
  handleUser,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: any[];
  selectedUser: any;
  handleUser: any;
}) {
  const handleClose = () => {
    setOpen(false);
  };
  const handleSelectedUser = (user: any) => {
    setOpen(false);
    handleUser(user);
  };
  return (
    <Box>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{position: "relative"}}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
              유저 선택
            </Typography>
          </Toolbar>
        </AppBar>

        <UserList friendList={users} handleSelectedUser={handleSelectedUser} selectedUser={selectedUser} />
        {/* {filteredUsers?.length ? <UserList filteredUsers={filteredUsers} handleSelectedUser={handleSelectedUser} /> : <NoData height="140px" />} */}
      </Dialog>
    </Box>
  );
}
function UserList({friendList, handleSelectedUser, selectedUser}: any) {
  // console.log("friendList  : ", friendList);
  return (
    <List sx={{padding: 0}}>
      {friendList.map((friend: any, index: number) => (
        <Box key={index} style={{height: "50px"}} onClick={() => handleSelectedUser(friend)}>
          선택 된 친구 : {friend.friendName}
        </Box>
      ))}
    </List>
  );
}
