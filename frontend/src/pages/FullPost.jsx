import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Post, CommentsBlock } from "../components";
import { AddComment } from "../components/AddComment";
import { fetchComments } from "../redux/slices/comments";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const Container = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  position: "relative",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export const FullPost = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);
  const { items: comments, status: commentsStatus } = useSelector(
    (state) => state.comments
  );

  useEffect(() => {
    setLoading(true);
    axios
      .get("/posts/" + id)
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        setLoading(false);
      });

    dispatch(fetchComments(id));
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <Container alignItems="center" justifyContent="center">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <>
        <Post
          _id={data._id}
          title={data.title}
          imageUrl={
            data.imageUrl
              ? `${process.env.REACT_APP_API_URL}${data.imageUrl}`
              : ""
          }
          user={data.user}
          createdAt={data.createdAt}
          viewsCount={data.viewsCount}
          commentsCount={comments.length}
          tags={data.tags}
          isFullPost
        >
          <Box sx={{ mt: 2 }}>
            <ReactMarkdown children={data.text} />
          </Box>
        </Post>
      </>

      <>
        <CommentsBlock
          items={comments.map((comment) => ({
            ...comment,
            post: id,
            user: comment.author,
            isEditable: userData?._id === comment.author._id,
          }))}
          isLoading={commentsStatus === "loading"}
        >
          <AddComment postId={id} />
        </CommentsBlock>
      </>
    </Container>
  );
};
