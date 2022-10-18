const defaultOrgState = {
  orgTitles: [],
  orgEvents: [],
  orgMessages: [],
  orgResources: [],
};

const organizationReducer = (state = defaultOrgState, action) => {
  switch (action.type) {
    case "SET_ORG":
      return {
        ...state,
        orgTitles: action.payload[0].titles,
        orgEvents: action.payload[0].events,
        orgMessages: action.payload[0].messages,
        orgResources: action.payload[0].resources,
      };
    default:
      return state;
  }
};

export default organizationReducer;