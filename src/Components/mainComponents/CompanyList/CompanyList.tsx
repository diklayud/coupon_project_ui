import CompanyModel from "../../model/CompanyModel";
import CompanyCard from "../CompanyCard/CompanyCard";
import "./CompanyList.css";

interface CompanyListProps {
    companies: CompanyModel[];
}

function CompanyList(props: CompanyListProps): JSX.Element {
    return (
        <div className="CompanyList">
            {props.companies.map(company => <CompanyCard key={company.id} {...company} />)}
        </div>
    );
}

export default CompanyList;
