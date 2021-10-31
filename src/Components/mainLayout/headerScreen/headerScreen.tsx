import "./headerScreen.css";
import logoImg from "../../assets/logo.png";


function HeaderScreen(): JSX.Element {
    return (
        <div className="headerScreen">

            <img src={logoImg} height="140" width="500" alt="Photo of logo" />

        </div>
    );
}

export default HeaderScreen;
