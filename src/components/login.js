const Login = (props) => {
    return (
        <div className="siteName">
            <h1 className="bigText"><strong>Playlist Lyric Searcher</strong></h1>

            {props.children}
        </div>
    );
}

export default Login;
