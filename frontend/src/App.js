import Container from "@mui/material/Container";
import {Route, Routes} from "react-router-dom";
import {Header} from "./components";
import {AddPost, FullPost, Home, Login, Registration} from "./pages";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuthMe, selectIsAuth} from "./redux/slices/auth";
import {useEffect} from "react";
import {TagPosts} from "./pages/TagPosts";

function App() {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, []);

    return (
        <>
            <Header/>
            <Container maxWidth="lg">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/posts/tag/:tag" element={<TagPosts/>}/>
                    <Route path="/posts/:id" element={<FullPost/>}/>
                    <Route path="/posts/create" element={<AddPost/>}/>
                    <Route path="/posts/:id/edit" element={<AddPost/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Registration/>}/>
                </Routes>
            </Container>
        </>
    );
}

export default App;
