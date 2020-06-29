import {createStore} from'redux';

/* initial state of the whole app */
const initialState = {
    name : ''
}

/* action producer which produces a redux action */
function setNameReducer(name){
    return{
        type:'Name',
        info:name
    }
}

/* Reducer function  contains logic for every action produced*/
const reducer = (state = initialState, action)=>{
    switch(action.type){
        case 'Name' :return {
            ...state , name:action.info
        }

        default: return state
    }
}


/* making the redux store */
const store = createStore(reducer);

export {
    store,
    setNameReducer
}