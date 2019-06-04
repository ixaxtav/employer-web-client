import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import {Notifier} from 'bc-react-notifier';
import loginBanner from '../../img/login-banner.png';
import {validator, onlyLetters} from '../utils/validation';

import { BrowserView, MobileView } from "react-device-detect";

import googleIcon from '../../img/icons/google-play.svg';
import appleIcon from '../../img/icons/apple-store.svg';
import SVG from 'react-svg-inline';

export class Login extends React.Component{
    constructor(){
        super();
        this.state = { email: 'aalejo@gmail.com', password: '1234', company: '', loading: false };
    }
    render(){
        return (
            <div className="public_view login_view">
                <img className="banner" src={loginBanner} />
                <Notifier />
                <MobileView>
                    <h4>Please login from the mobile application</h4>
                    <a href="#">
                        <SVG className="store-icon" svg={googleIcon} />
                    </a>
                    <a href="#">
                        <SVG className="store-icon" svg={appleIcon} />
                    </a>
                </MobileView>
                <BrowserView>
                    <form className="col-10 col-sm-5 col-md-4 col-lg-3 mx-auto"
                        onSubmit={(e)=> {
                            e.preventDefault();
                            this.setState({loading: true});
                            actions.login(this.state.email, this.state.password, this.props.history)
                                .then(() => this.setState({loading: false}))
                                .catch(() => this.setState({loading: false}));
                        }}
                    >
                        <div className="form-group">
                            <input type="email" className="form-control rounded" aria-describedby="emailHelp" placeholder="Email"
                                value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control rounded" id="exampleInputPassword1" placeholder="Password"
                                 onChange={(e) => this.setState({password: e.target.value})} value={this.state.password}
                            />
                        </div>
                        {(this.state.loading) ?
                            <button type="submit" className="btn btn-default form-control" disabled>Loading...</button>
                        :
                            <button type="submit" className="btn btn-primary form-control">Sign In</button>
                        }
                        <div className="extra-actions">
                            <Link to="/signup" className="float-left ml-4 mt-2">Sign Up</Link>
                            <Link to="/forgot" className="float-right mr-4 mt-2">Forgot Password</Link>
                        </div>
                    </form>
                </BrowserView>
            </div>
        );
    }
}
Login.propTypes = {
    history: PropTypes.object
};
export class Signup extends React.Component{
    constructor(){
        super();
        this.state = { email: 'aalejo@gmail.com', password: '', first_name: '', last_name:'', company: 1, loading: false, errors: [] };
    }
    validate(formData){
        let errors = [];
        if(!validator.isEmail(formData.email)) errors.push('Invalid email');
        if(validator.isEmpty(formData.first_name)) errors.push('The first name cannot be empty');
        if(!validator.isLength(formData.first_name, { min: 0, max: 50 })) errors.push('The first name can have a max of 50 characters');
        if(!validator.isLength(formData.last_name, { min: 0 ,max: 50 })) errors.push('The last name can have a max of 50 characters');
        if(!onlyLetters(formData.first_name) || !onlyLetters(formData.last_name)) errors.push('First and last name cannot contain numbers');
        if(validator.isEmpty(formData.last_name)) errors.push('The last name cannot be empty');
        if(validator.isEmpty(formData.password)) errors.push('The password cannot be empty');
        if(!validator.isLength(formData.password, { min: 8, max: 50 })) errors.push('Password must have between 8 and 50 characters');

        this.setState({ errors, loading: false });
        return errors.length == 0;
    }
    render(){
        return (
            <div className="public_view login_view">
                <img className="banner" src={loginBanner} />
                <Notifier />
                {(this.state.errors.length>0) ?
                    <div className="alert alert-danger">
                        <ul>
                            { this.state.errors.map((err, i) => (<li key={i}>{err}</li>)) }
                        </ul>
                    </div>:''
                }
                <form className="col-10 col-sm-8 col-md-4 col-lg-4 mx-auto mb-5"
                    onSubmit={(e)=> {
                        this.setState({loading: true});
                        e.preventDefault();

                        const formData = {
                            email: this.state.email,
                            password: this.state.password,
                            first_name: this.state.first_name,
                            last_name: this.state.last_name,
                            company: this.state.company,
                            account_type: 'employer'
                        };
                        if(this.validate(formData)) actions.signup(formData, this.props.history)
                            .then(() => this.setState({loading: false}))
                            .catch(() => this.setState({loading: false}));
                    }}
                >
                    <div className="form-group">
                        <input type="text" className="form-control rounded" aria-describedby="emailHelp" placeholder="Company Name"
                            value="Fetes & Events" readOnly={true}
                        />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control rounded" aria-describedby="fHelp" placeholder="First Name"
                            value={this.state.first_name}
                            onChange={(e) => this.setState({first_name: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control rounded" aria-describedby="lHelp" placeholder="Last Name"
                            value={this.state.last_name}
                            onChange={(e) => this.setState({last_name: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <input type="email" className="form-control rounded" aria-describedby="emailHelp" placeholder="Email"
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control rounded" id="exampleInputPassword1" placeholder="Password"
                             onChange={(e) => this.setState({password: e.target.value})} value={this.state.password}
                        />
                    </div>
                    {(this.state.loading) ?
                        <button type="submit" className="btn btn-default form-control" disabled>Loading...</button>
                    :
                        <button type="submit" className="btn btn-primary form-control">Sign Up</button>
                    }
                    <div className="extra-actions">
                        <Link to="/login" className="float-left ml-4 mt-2">Log In</Link>
                        <Link to="/forgot" className="float-right mr-4 mt-2">Forgot Password</Link>
                    </div>
                </form>
            </div>
        );
    }
}
Signup.propTypes = {
    history: PropTypes.object
};
export class Forgot extends React.Component{
    constructor(){
        super();
        this.state = { email: 'aalejo@gmail.com', loading: false };
    }
    render(){
        return (
            <div className="public_view login_view">
                <img className="banner" src={loginBanner} />
                <Notifier />
                <form className="col-10 col-sm-5 col-md-4 col-lg-3 mx-auto"
                    onSubmit={(e)=> {
                        e.preventDefault();
                        this.setState({ loading: true });
                        actions.remind(this.state.email, this.props.history)
                            .then(() => this.setState({loading: false}))
                            .catch(() => this.setState({loading: false}));
                    }}
                >
                    <div className="form-group">
                        <input type="email" className="form-control rounded" aria-describedby="emailHelp" placeholder="Email"
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                    </div>
                    {(this.state.loading) ?
                        <button type="submit" className="btn btn-default form-control" disabled>Loading...</button>
                    :
                        <button type="submit" className="btn btn-primary form-control">Send remind link</button>
                    }
                    <div className="extra-actions">
                        <Link to="/login" className="float-left ml-4 mt-2">Back to login</Link>
                    </div>
                </form>
            </div>
        );
    }
}
Forgot.propTypes = {
    history: PropTypes.object
};

export class Invite extends React.Component{
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            repPassword: '',
            first_name: '',
            last_name: '',
            error: null
        };
    }
    render(){
        return (
            <div className="row mt-5">
                <div className="col-12 col-sm-10 col-md-9 col-lg-8 col-xl-6 mx-auto">
                    <img className="banner w-100" src={loginBanner} />
                    <h2 className="my-4 text-center">The company Fetes Events LLC wants to hire you for an event and its inviting you to apply, please fill the following form to complete your application:</h2>
                    <form className="col-12 col-lg-10 mx-auto"
                        onSubmit={(e)=> {
                            e.preventDefault();
                            this.setState({ error: null });
                            if(this.state.password != this.state.repPassword) this.setState({ error: `Your passwords don't match` });
                            else{
                                actions.signup({
                                    email: this.state.email,
                                    password: this.state.password,
                                    first_name: this.state.first_name,
                                    last_name: this.state.last_name,
                                    account_type: 'employee'
                                }, this.props.history)
                                    .then(() => this.setState({loading: false, error: null }))
                                    .catch((error) => this.setState({loading: false, error }));
                            }

                        }}
                    >
                        { this.state.error && <div className="alert alert-danger">{this.state.error}</div> }
                        <div className="form-group">
                            <input type="text" className="form-control rounded" aria-describedby="emailHelp" placeholder="First Name"
                                onChange={(e) => this.setState({first_name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control rounded" aria-describedby="emailHelp" placeholder="Last Name"
                                onChange={(e) => this.setState({last_name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input type="email" className="form-control rounded" aria-describedby="emailHelp" placeholder="Email"
                                value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control rounded" id="exampleInputPassword1" placeholder="Password"
                                 onChange={(e) => this.setState({password: e.target.value})} value={this.state.password}
                            />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control rounded" id="exampleInputPassword1" placeholder="Password"
                                 onChange={(e) => this.setState({repPassword: e.target.value})} value={this.state.repPassword}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary form-control">Sign Up</button>
                    </form>
                </div>
            </div>
        );
    }
}
Invite.propTypes = {
    history: PropTypes.object
};