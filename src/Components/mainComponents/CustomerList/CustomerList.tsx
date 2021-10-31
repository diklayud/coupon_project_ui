import CustomerModel from "../../model/CustomerModel";
import CustomerCard from "../CustomerCard/CustomerCard";
import "./CustomerList.css";

interface CustomerListProps {
    customers: CustomerModel[];
}

function CustomerList(props: CustomerListProps): JSX.Element {
    return (
        <div className="CustomerList">

            {props.customers.map(customer => <CustomerCard key={customer.id} {...customer} />)}

        </div>
    );
}

export default CustomerList;
