const defaultOrgState = {
  orgTitles: [],
  orgEvents: [],
  orgMessages: [],
};

const organizationReducer = (state = defaultOrgState, action) => {
  switch (action.type) {
    case "SET_ORG":
      return action.payload;
    case "SET_ORG_TITLES":
      return { ...state, orgTitles: action.payload };
    case "SET_ORG_EVENTS":
      return { ...state, orgEvents: action.payload };
    case "SET_ORG_MESSAGES":
      return { ...state, orgMessages: action.payload };
    default:
      return state;
  }
};

export default organizationReducer;
