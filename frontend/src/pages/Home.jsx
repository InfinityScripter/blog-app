import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { CommentsBlock, Post, TagsBlock } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags, fetchPostsByTag } from "../redux/slices/posts";
import { getLastComments } from "../redux/slices/comments";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const { items: lastComments, status: commentsStatus } = useSelector(
    (state) => state.comments
  );
  const [activeTab, setActiveTab] = useState(0);
  const [activeTag, setActiveTag] = useState(null);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const isCommentsLoading = commentsStatus === "loading";

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setActiveTag(null);
  };

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    dispatch(fetchPostsByTag(tag));
  };

  // Обновляем посты при смене вкладки
  useEffect(() => {
    if (!activeTag) {
      dispatch(fetchPosts(activeTab === 0 ? "date" : "views"));
    }
  }, [activeTab]);

  // Загружаем теги и последние комментарии только один раз
  useEffect(() => {
    dispatch(fetchTags());
    dispatch(getLastComments());
  }, []);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={activeTab}
        onChange={handleTabChange}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      {activeTag && (
        <div style={{ marginBottom: 15 }}>
          <h2>Посты по тегу: #{activeTag}</h2>
        </div>
      )}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {(isPostsLoading ? Array.from({ length: 5 }) : posts.items).map(
            (obj, index) =>
              isPostsLoading ? (
                <Post key={index} isLoading={true} />
              ) : (
                <Post
                  key={obj._id}
                  {...obj}
                  imageUrl={
                    obj.imageUrl
                      ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                      : ""
                  }
                  isEditable={userData?._id === obj.user._id}
                />
              )
          )}
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          <TagsBlock
            items={tags.items}
            isLoading={isTagsLoading}
            onTagClick={handleTagClick}
          />
          <CommentsBlock
            items={lastComments.map((comment) => ({
              ...comment,
              user: comment.author,
            }))}
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
