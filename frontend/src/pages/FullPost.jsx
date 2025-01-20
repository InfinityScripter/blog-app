import React, {useEffect} from "react";

import {Post,Index,CommentsBlock} from "../components";
import {useParams} from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
    const [data, setData] = React.useState(null)
    const [isLoading, setLoading] = React.useState(true)
    const {id} = useParams()


    useEffect(() => {
        setLoading(true)
        axios.get('/posts/' + id).then(({data}) => {
            setData(data)
            setLoading(false)
            console.log(data)
        }).catch((err) => {
            console.warn(err)
            setLoading(false)

        })
    }, [id]);

    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost/>
    }

    return (
        <>
            <Post
                _id={data._id}
                title={data.title}
                imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={3}
                tags={data.tags}
                isFullPost
            >
                <ReactMarkdown
                    children={data.text}
                />
            </Post>
            <CommentsBlock
                items={[
                    {
                        user: {
                            fullName: "Вася Пупкин",
                            avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                        },
                        text: "Это тестовый комментарий 555555",
                    },
                    {
                        user: {
                            fullName: "Иван Иванов",
                            avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                        },
                        text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
                    },
                ]}
                isLoading={false}
            >
                <Index/>
            </CommentsBlock>
        </>
    );
};
