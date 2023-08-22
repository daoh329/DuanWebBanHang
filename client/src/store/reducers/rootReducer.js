const initialState = {
    users: [],
    posts:[]
};


const rootReducer = (state = initialState, action) =>{

    switch(action.type){
        case 'DELETE_USER':
            const updatedUsers = state.users.filter(item => item.id !== action.payload);
            return {
                ...state,
                users: updatedUsers
            };
        case 'CREATE_USER':          
            return{
                ...state, users:[...state.users,  action.payload]
            }
            case 'UPDATE_USER':
            const updatedUserIndex = state.users.findIndex(item => item.id === action.payload.id);
            if (updatedUserIndex !== -1) {
                const updatedUsers = [...state.users];
                updatedUsers[updatedUserIndex] = action.payload;
                return {
                    ...state,
                    users: updatedUsers
                };
            }
            return state;
        default: return state;
    }
}

export default rootReducer;