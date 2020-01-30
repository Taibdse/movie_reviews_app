import toastr from 'toastr';


class AlertUtils{
    static showAlert({ type, title, description }){
        return toastr[type](title);
    }
}

export default AlertUtils;