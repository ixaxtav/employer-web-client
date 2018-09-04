import React from 'react';
import PropTypes from 'prop-types';
import {create, update, remove, updateTalentList} from '../actions';
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';
import {Shift} from '../views/shifts';
import {Invite} from '../views/invites';
import {Favlist} from '../views/favorites';
import {Talent, ShiftInvite} from '../views/talents';
import {AddFavlist} from '../views/favorites';
import {ValidationError} from '../utils/validation';
import {Notify} from 'bc-react-notifier';

class RightBar extends React.Component {
    
    constructor(){
        super();
        this.state = {
            formData: {},
            catalog: null,
            error: null
        };
    }

    onSave(data={}){
        this.setState({ error: null });
        try{
            switch (this.props.option.slug) {
                case 'create_shift':
                    create('shifts', Shift(this.state.formData).validate().serialize());
                    this.props.onClose();
                break;
                case 'update_shift':
                    update('shifts', Shift(Object.assign(this.state.formData,data)).validate().serialize());
                    this.props.onClose();
                break;
                case 'filter_shift':{
                        if(data === false) this.props.history.push('/shifts');
                        else{
                            const stringified = queryString.stringify(this.state.formData);
                            this.props.history.push('/shifts?'+stringified);
                        }
                    }
                break;
                case 'invite_talent_to_jobcore':{
                        create('jobcore-invites', Invite(this.state.formData).validate().serialize());
                        this.props.onClose();
                    }
                break;
                case 'invite_talent':{
                        create('shiftinvites', ShiftInvite(this.state.formData).validate().serialize());
                        this.props.onClose();
                    }
                break;
                case 'add_to_favlist':{
                        this.state.formData.favoriteLists.forEach((list)=>{
                            update("employees", Talent(this.state.formData).validate().serialize());
                        });
                        this.props.onClose();
                    }
                break;
                case 'filter_talent':{
                        if(data === false) this.props.history.push('/talents');
                        else{
                            const stringified = queryString.stringify(Talent(this.state.formData).filters());
                            this.props.history.push('/talents?'+stringified);
                        }
                    }
                break;
                case 'create_favlist':{
                        create('favlists', Favlist(this.state.formData).validate().serialize());
                        this.props.onClose();
                    }
                break;
                case 'update_favlist':{
                        update('favlists',Favlist(this.state.formData).validate().serialize(['employees']));
                        this.props.onClose();
                    }
                break;
                default: throw new Error("Missing logic onSave() for "+this.props.option.slug);
            }
        }
        catch(error){
            if(error instanceof ValidationError || error.validation){
                this.setState({error: error.message});
            }
            else throw error;
        }
            
    }
    
    componentDidMount(){
        if(this.props.formData) this.setState({ formData: this.props.formData });
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.formData && prevState.formData !== nextProps.formData) {
            return {
                formData: nextProps.formData
            };
        }
        
        // Return null to indicate no change to state.
        return null;
    }
    
    onChange(incoming){
        if(this.noNewFavlist(incoming)){
            const data = Object.assign(this.state.formData, incoming);
            this.setState({ formData: data });
        }
        else{
            let noti = Notify.add('info', AddFavlist, (proceed)=>{
                if(proceed) noti.remove();
            }, 9999999999999);
        }
    }
    
    noNewFavlist(incomingFormData){
        if(typeof incomingFormData.favoriteLists == 'undefined') return true;
        if(!incomingFormData.favoriteLists.find(fav => fav.value == "new_favlist")) return true;
        
        
    }
    
    render(){
        const View = this.props.component;
        const styles = { width: this.props.width , right: (this.props.level * this.props.width)};
        
        return (<div className="right-bar" style={styles}>
            <h1>{this.props.option.title}</h1>
            {
                (this.state.error) ? <div className="alert alert-danger">{this.state.error}</div> : ''
            }
            <View 
                catalog={this.props.catalog}
                formData={this.state.formData}
                onSave={(data)=> this.onSave(data)} 
                onCancel={(incoming)=>this.props.onClose(incoming)} 
                onChange={(incoming)=>this.onChange(incoming)} 
            />
            { (this.props.isCollapsable) ? 
                <button className="collapsebtn"
                    onClick={() => this.props.onClose()}
                ><i className="fas fa-angle-double-right"></i></button>
                :''
            }
        </div>);
    }

}

RightBar.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequired,
  level: PropTypes.number,
  width: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  isCollapsable: PropTypes.bool,
  history: PropTypes.object.isRequired,
  option: PropTypes.object.isRequired,
  formData:  PropTypes.object,
  catalog:PropTypes.object
};
RightBar.defaultProps = {
  formData: null,
  isCollapsable: false,
  level: 0,
  width: 370
};
export default withRouter(RightBar);