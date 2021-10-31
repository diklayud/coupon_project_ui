import { Button, ButtonGroup, TextField } from "@material-ui/core";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CompanyModel from "../../model/CompanyModel";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import "./addCompany.css";


function AddCompany(): JSX.Element {

  const { register, handleSubmit, setError, formState: { errors }, reset } = useForm<CompanyModel>();

  const history = useHistory();

  async function send(companyDetails: CompanyModel) {
    const url = globals.urls.admin + "add/company";
    // get JWT and send the company with JWT
    const token = store.getState().authState.loginUser.token;

    axios.post(url, companyDetails, {
      headers: {
        'Authorization': 'Bearer ' + `${token}`
      }
    })
      .then((response) => {
        console.log("CLAPS!!!!! COMPANY ADDED");
        store.dispatch(loginUserString(response.headers.authorization));
        notify.success("COMPANY ADDED SUCCESSFULLY!!!");
        reset();
      })
      .catch(error => {
        notify.error(error.response.data.description);
        noTokenPushToLogin(error.response.data.description, history);
      })
  }

  return (
    <div className="smallBox companyDiv">
      <h3>Add new company to the system</h3>
      <hr />
      <form onSubmit={handleSubmit(send)}>
        <TextField label="Company Name" variant="outlined" size="small" {...register("name",
          {
            required: { value: true, message: "this field is required" },
            minLength: { value: 1, message: "minimum length is 1" },
            maxLength: { value: 50, message: "maximum length is 50" }
          })} />
        <br />
        <span> {errors.name && <p>{errors.name.message}</p>}</span>
        <br />
        <TextField label="Company Email" variant="outlined" type="email" size="small" {...register("email",
          {
            required: { value: true, message: "this field is required" },
            minLength: { value: 7, message: "minimum length is 7" },
            maxLength: { value: 50, message: "maximum length is 50" }, 
          })} />
        <br />
        <span> {errors.email && <p>{errors.email.message}</p>}</span>
        <br />
        <TextField label="Company Password" variant="outlined" type="password" size="small" {...register("password",
          {
            required: { value: true, message: "this field is required" },
            minLength: { value: 3, message: "minimum length is 3" },
            maxLength: { value: 10, message: "maximum length is 10" }
          })} />
        <br />
        <span> {errors.password && <p>{errors.password.message}</p>}</span>

        <br />
        <br />
        <ButtonGroup variant="contained" fullWidth>
          <Button type="submit" color="primary">Add Company</Button>
        </ButtonGroup>
      </form>

    </div>
  );
}

export default AddCompany;