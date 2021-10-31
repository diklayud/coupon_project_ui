import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { loginUserString } from "../../redux/authState";
import store from "../../redux/store";
import { noTokenPushToLogin } from "../../utils/common";
import globals from "../../utils/Globals";
import notify from "../../utils/Notify";

function DeleteCompany(): JSX.Element {

    const [open, setOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(Number);

    const history = useHistory();

    function handleChange(event: any) {
        setCompanyToDelete(event.target.value);
    }

    const handleClickOpenClose = () => {
        setOpen(open == false ? true : false);
    };

    async function send() {
        const url = globals.urls.admin + "delete/company/" + `${companyToDelete}`;
        const token = store.getState().authState.loginUser.token;
        let response = await axios.delete(url, {
            headers: {
                'Authorization': 'Bearer ' + `${token}`
            }
        })
        .then((response) => {
            handleClickOpenClose();
            console.log(`CLAPS!!!!! COMPANY ${companyToDelete} DELETED`);
            setCompanyToDelete(0);
            store.dispatch(loginUserString(response.headers.authorization));
            notify.success("COMPANY DELETED SUCCESSFULLY!!!");
        })
        .catch(error => {
            handleClickOpenClose();
            notify.error(error.response.data.description);
            noTokenPushToLogin(error.response.data.description, history);
        })
    }

    return (
        <div className="companyDiv smallBox">
            <h3>Delete company from the system</h3>
            <hr />
            <TextField label="Company ID" variant="outlined" size="small" value={companyToDelete || ''} onChange={handleChange}
                required />
            <br />
            <br />
            <ButtonGroup variant="contained" fullWidth>
                <Button type="submit" color="secondary" onClick={handleClickOpenClose} disabled={companyToDelete == 0} >Delete Company</Button>
            </ButtonGroup>

            <Dialog
                open={open}
                onClose={handleClickOpenClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete this Company?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a company is not returnable, after you will delete the
                        company it will be lost forever.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickOpenClose}>CANCEL</Button>
                    <Button onClick={send} autoFocus>
                        CONTINUE
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeleteCompany;
