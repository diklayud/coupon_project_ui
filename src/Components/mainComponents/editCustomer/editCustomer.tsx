import { Button, ButtonGroup, TextField } from "@material-ui/core";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import CustomerModel from "../../model/CustomerModel";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";
import "./editCustomer.css";

interface CustomerEditCardProps {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  afterEditfunc: any;
}

function EditCustomer(props: CustomerEditCardProps): JSX.Element {

  const { register, handleSubmit, setError, formState: { errors } } = useForm<CustomerModel>();

  const history = useHistory();

  async function send(customerDetails: CustomerModel) {
    customerDetails.id = props.id;

    const url = globals.urls.admin + "update/customer";
    // get JWT and send the company with JWT
    const token = store.getState().authState.loginUser.token;
    let response = await axios.post(url, customerDetails, {
      headers: {
        'Authorization': 'Bearer ' + `${token}`
      }
    })
      .then((response) => {
        console.log("CLAPS!!!!! CUSTOMER EDITED");
        props.afterEditfunc();
        store.dispatch(loginUserString(response.headers.authorization));
        notify.success("CUSTOMER EDITED!!!");
      })
      .catch(error => {
        notify.error(error.response.data.description);
        noTokenPushToLogin(error.response.data.description, history);
      })
  }

  return (
    <div className="customerDiv smallBox">

      <h3>Edit customer</h3><hr />
      <form onSubmit={handleSubmit(send)}>
        <TextField label="Customer ID" variant="outlined" size="small"
          defaultValue={props.id}
          {...register("id")}
          disabled
        />
        <br />
        <br />
        <TextField label="Customer New First Name" variant="outlined" size="small" defaultValue={props.firstName} {...register("firstName",
          {
            minLength: { value: 1, message: "minimum length is 1" },
            maxLength: { value: 50, message: "maximum length is 50" }
          })} />
        <br />
        <span> {errors.firstName && <p>{errors.firstName.message}</p>}</span>
        <br />
        <TextField label="Customer New Last Name" variant="outlined" size="small" defaultValue={props.lastName} {...register("lastName",
          {
            minLength: { value: 1, message: "minimum length is 1" },
            maxLength: { value: 50, message: "maximum length is 50" }
          })} />
        <br />
        <span> {errors.lastName && <p>{errors.lastName.message}</p>}</span>
        <br />
        <TextField label="Customer New Email" variant="outlined" type="email" size="small" defaultValue={props.email} {...register("email",
          {
            minLength: { value: 1, message: "minimum length is 5" },
            maxLength: { value: 50, message: "maximum length is 50" }
          })} />
        <br />
        <span> {errors.email && <p>{errors.email.message}</p>}</span>
        <br />
        <TextField type="password" label="Customer New Password" variant="outlined" size="small" defaultValue={props.password} {...register("password", {
          minLength: { value: 3, message: "minimum length is 3" },
          maxLength: { value: 10, message: "maximum length is 10" }
        })} />
        <br />
        <span> {errors.password && <p>{errors.password.message}</p>}</span>

        <br />
        <br />
        <ButtonGroup variant="contained" fullWidth>
          <Button type="submit" color="primary">Edit Customer</Button>
        </ButtonGroup>
      </form>

    </div>
  );
}

export default EditCustomer;
