import React from "react";
import { SideBlock } from "./SideBlock";
import { CommentBlock } from "./CommentBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";

import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";

export const CommentsBlock = ({ items, children, isLoading = true }) => {
  return (
    <SideBlock title="Комментарии">
      <Divider />
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={obj?._id || index}>
            {isLoading ? (
              <>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={45} />
                    <Skeleton variant="text" height={18} width={50} />
                  </div>
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            ) : (
              <CommentBlock comment={obj} isEditable={obj.isEditable} />
            )}
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
