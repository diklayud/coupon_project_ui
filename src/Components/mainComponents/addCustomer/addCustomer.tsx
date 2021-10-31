import { Button, ButtonGroup, TextField } from "@material-ui/core";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CustomerModel from "../../model/CustomerModel";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import "./addCustomer.css";


function AddCustomer(): JSX.Element {

  const { register, handleSubmit, setError, formState: { errors }, reset } = useForm<CustomerModel>();

  const history = useHistory();

  async function send(customerDetails: CustomerModel) {

    const url = globals.urls.admin + "add/customer";
    const token = store.getState().authState.loginUser.token;
    axios.post(url, customerDetails, {
      headers: {
        'Authorization': 'Bearer ' + `${token}`
      }
    }).then((response) => {
      console.log("CLAPS!!!!! CUSTOMER ADDED");

      store.dispatch(loginUserString(response.headers.authorization));
      notify.success("CUSTOMER ADDED SUCCESSFULLY!!!");
      reset();
    })
      .catch(error => {
        notify.error(error.response.data.description);
        noTokenPushToLogin(error.response.data.description, history);
      })
  }

  return (
    <div className="customerDiv smallBox">
      <h3>Add new customer to the system</h3>
      <hr />
      <form onSubmit={handleSubmit(send)}>
        <TextField label="Customer First Name" variant="outlined" size="small" {...register("firstName",
          {
            required: { value: true, message: "this field is required" },
            minLength: { value: 1, message: "minimum length is 1" },
            maxLength: { value: 50, message: "maximum length is 50" }
          })} />
        <br />
        <span> {errors.firstName && <p>{errors.firstName.message}</p>}</span>
        <br />
        <TextField label="Customer Last Name" variant="outlined" size="small" {...register("lastName",
          {
            required: { value: true, message: "this field is required" },
            minLength: { value: 1, message: "minimum length is 1" },
            maxLength: { value: 50, message: "maximum length is 50" }
          })} />
        <br />
        <span> {errors.lastName && <p>{errors.lastName.message}</p>}</span>
        <br />
        <TextField label="Customer Email" type="email" variant="outlined" size="small" {...register("email",
          {
            required: { value: true, message: "this field is required" },
            minLength: { value: 7, message: "minimum length is 7" },
            maxLength: { value: 50, message: "maximum length is 50" }
          })} />
        <br />
        <span> {errors.email && <p>{errors.email.message}</p>}</span>
        <br />
        <TextField label="Customer Password" variant="outlined" type="password" size="small" {...register("password",
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
          <Button type="submit" color="primary">Add Customer</Button>
        </ButtonGroup>
      </form>
    </div>
  );
}

export default AddCustomer;
