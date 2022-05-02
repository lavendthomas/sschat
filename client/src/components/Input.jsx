const Input = (props) => {
    return (
        <div className="form-input">
            <label>{props.label}</label>
            <input type = {props.type} ref={props.refer} />
        </div>
    );
};

export default Input;