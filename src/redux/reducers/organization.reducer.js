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
    case "SET_ORG_USERS":
      return {
        ...state,
        orgUsers: action.payload[0].users,
      };
    case "SET_TYPES":
      return { ...state, orgTypes: action.payload };
    case "SET_PARTICIPANTS":
      return { ...state, eventParticipants: action.payload };
    default:
      return state;
  }
};

export default organizationReducer;
