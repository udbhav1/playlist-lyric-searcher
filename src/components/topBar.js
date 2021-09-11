import githubLogo from '../images/github-logo.png'
import backButton from '../images/back-button.png'

const TopBar = (props) => (
    <div id="topBar">
      {props.backButton &&
        <a id="backButtonContainer" href="/">
          <img src={backButton} width="42" height="42" alt="Back Button" />
        </a>
      }
      <a id="githubLogoContainer" href="https://github.com/udbhav1/playlist-lyric-searcher">
        <img src={githubLogo} width="42" height="42" alt="Github Logo"/>
      </a>
    </div>

);

export default TopBar;
