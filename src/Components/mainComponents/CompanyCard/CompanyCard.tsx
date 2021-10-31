import store from "../../redux/store";
import "./CompanyCard.css";

interface CompanyCardProps {
    id: number;
    name: string;
    email: string;
}

function CompanyCard(props: CompanyCardProps): JSX.Element {

    const loggedInId = store.getState().authState.loginUser.userId;

    return (
        <div className="CompanyCard smallBox" style={{ display: (loggedInId === 0) ? "inline-block" : "block" }}>

            <span><b>ID:</b> {props.id}</span><br /><br />
            <span><b>Name:</b> {props.name}</span><br /><br />
            <span><b>Email:</b> {props.email}</span><br /><br />

        </div>
    );
}

export default CompanyCard;
