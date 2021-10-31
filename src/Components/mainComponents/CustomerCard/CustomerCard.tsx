import store from "../../redux/store";
import "./CustomerCard.css";

interface CustomerCardProps {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

function CustomerCard(props: CustomerCardProps): JSX.Element {

    const loggedInId = store.getState().authState.loginUser.userId;

    return (
        <div className="CustomerCard smallBox" style={{ display: (loggedInId === 0) ? "inline-block" : "block" }}>

            <span><b>ID:</b> {props.id}</span><br /><br />
            <span><b>First Name:</b> {props.firstName}</span><br /><br />
            <span><b>Last Name:</b> {props.lastName}</span><br /><br />
            <span><b>Email:</b> {props.email}</span><br /><br />

        </div>
    );
}

export default CustomerCard;
