import "./page404.css";
import errorImg from "../../assets/errorImg.jpg";

function Page404(): JSX.Element {
    return (
        <div className="page404">
            <img src={errorImg} height="460" width="900" alt="Photo of 404 code" />
        </div>
    );
}

export default Page404;
