import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { CommentsBlock, Post, TagsBlock } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByTag, fetchTags } from "../redux/slices/posts";
import { getLastComments } from "../redux/slices/comments";
import { Typography } from "@mui/material";

export const TagPosts = () => {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const [sortBy, setSortBy] = useState("date");
  const { items: lastComments, status: commentsStatus } = useSelector(
    (state) => state.comments
  );
  const isCommentsLoading = commentsStatus === "loading";

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const handleTagClick = (tag) => {
    dispatch(fetchPostsByTag({ tag, sort: sortBy }));
  };

  const handleSortChange = (event, newValue) => {
    setSortBy(newValue);
    dispatch(fetchPostsByTag({ tag, sort: newValue }));
  };

  useEffect(() => {
    dispatch(fetchPostsByTag({ tag, sort: sortBy }));
    // Загружаем теги и последние комментарии только один раз
    dispatch(fetchTags());
    dispatch(getLastComments());
  }, [tag, dispatch, sortBy]);

  return (
    <>
      <Typography
        variant="h2"
        color="text.secondary"
        style={{ marginBottom: 15 }}
      >
        Посты по тегу: #{tag}
      </Typography>
      <Tabs
        style={{ marginBottom: 15 }}
        value={sortBy}
        onChange={handleSortChange}
        aria-label="sort options"
      >
        <Tab value="date" label="По дате" />
        <Tab value="views" label="По просмотрам" />
      </Tabs>
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
