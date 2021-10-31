import { Button, ButtonGroup, TextField } from "@material-ui/core";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import CompanyModel from "../../model/CompanyModel";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import "./editCompany.css";

interface CompanyEditCardProps {
  id: number;
  email: string;
  password: string;
  name: string;

  afterEditfunc: any;
}

function EditCompany(props: CompanyEditCardProps): JSX.Element {

  const { register, handleSubmit, setError, formState: { errors } } = useForm<CompanyModel>();

  const history = useHistory();

  async function send(companyDetails: CompanyModel) {
    companyDetails.id = props.id;
    companyDetails.name = props.name;
    // get JWT and send the company with JWT
    const url = globals.urls.admin + "update/company";
    const token = store.getState().authState.loginUser.token;
    let response = await axios.post(url, companyDetails, {
      headers: {
        'Authorization': 'Bearer ' + `${token}`
      }
    })
      .then((response) => {
        props.afterEditfunc();
        store.dispatch(loginUserString(response.headers.authorization));
        notify.success("COMPANY EDITED!!!");
      })
      .catch(error => {
        notify.error(error.response.data.description);
        noTokenPushToLogin(error.response.data.description, history);
      })
  }

  return (
    <div className="companyDiv smallBox">

      <h3>Edit company</h3><hr />
      <form onSubmit={handleSubmit(send)}>
        <TextField label="Company ID" variant="outlined" size="small"
          defaultValue={props.id}
          {...register("id")}
          disabled
        />
        <br />
        <br />
        <TextField label="Company Name" variant="outlined" size="small"
          defaultValue={props.name}
          {...register("name")}
          disabled />
        <br />
        <br />
        <TextField label="Company Email" type="email" variant="outlined" size="small" defaultValue={props.email} {...register("email", {
          minLength: { value: 7, message: "minimum length is 7" },
          maxLength: { value: 50, message: "maximum length is 50" }
        })} />
        <br />
        <span> {errors.email && <p>{errors.email.message}</p>}</span>
        <br />
        <TextField type="password" label="Company Password" defaultValue={props.password}
          variant="outlined" size="small" {...register("password", {
            minLength: { value: 3, message: "minimum length is 3" },
            maxLength: { value: 10, message: "maximum length is 10" },
          })} />
        <br />
        <span> {errors.password && <p>{errors.password.message}</p>}</span>

        <br />
        <br />
        <ButtonGroup variant="contained" fullWidth>
          <Button type="submit" color="primary">Edit Company</Button>
        </ButtonGroup>
      </form>

    </div>
  );
}

export default EditCompany;
