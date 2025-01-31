import React from "react";
import { useNavigate } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";

import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items, isLoading = true }) => {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/posts/tag/${tag}`);
  };

  return (
    <SideBlock title="Тэги">
      <Divider />
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <React.Fragment key={isLoading ? i : name}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => !isLoading && handleTagClick(name)}
              >
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </SideBlock>
  );
};
