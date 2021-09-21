import githubLogo from '../images/github-logo.png'
import backButton from '../images/back-button.png'
import 'bulma/css/bulma.min.css';
import { Button } from 'react-bulma-components';

const TopBar = (props) => (
    <div id="topBar">
      {props.backButton &&
        <a id="backButtonContainer" href="/">
          <img src={backButton} width="42" height="42" alt="Back Button" />
        </a>
      }

      {props.logout &&
        <Button id="logoutButton" onClick={() => props.deleteFunc()}><b>Logout</b></Button>
      }
      <a id="githubLogoContainer" href="https://github.com/udbhav1/playlist-lyric-searcher" target="_blank" rel="noreferrer">
        <img src={githubLogo} width="42" height="42" alt="Github Logo"/>
      </a>
    </div>

);

export default TopBar;
