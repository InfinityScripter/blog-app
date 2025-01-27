import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Post, CommentsBlock } from "../components";
import { AddComment } from "../components/AddComment";
import { fetchComments } from "../redux/slices/comments";
import axios from "../axios";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
    const dispatch = useDispatch();
    const [data, setData] = React.useState(null);
    const [isLoading, setLoading] = React.useState(true);
    const { id } = useParams();
    const userData = useSelector((state) => state.auth.data);
    const { items: comments, status: commentsStatus } = useSelector((state) => state.comments);

    useEffect(() => {
        setLoading(true);
        axios.get('/posts/' + id)
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
        return <Post isLoading={isLoading} isFullPost />;
    }

    return (
        <>
            <Post
                _id={data._id}
                title={data.title}
                imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL}${data.imageUrl}` : ''}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={comments.length}
                tags={data.tags}
                isFullPost
            >
                <ReactMarkdown children={data.text} />
            </Post>
            <CommentsBlock
                items={comments.map(comment => ({
                    ...comment,
                    post: id,
                    user: comment.author,
                    isEditable: userData?._id === comment.author._id
                }))}
                isLoading={commentsStatus === 'loading'}
            >
                <AddComment postId={id} />
            </CommentsBlock>
        </>
    );
};
