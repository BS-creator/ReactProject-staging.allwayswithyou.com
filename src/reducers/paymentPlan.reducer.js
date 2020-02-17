import { paymentPlanConstants } from '../constants';

const initialState = { isFetching: true, paymentPlans: [] }

export function paymentPlan(state = initialState, action) {
  switch (action.type) {
    case paymentPlanConstants.GET_PAYMENT_PLANS_REQUEST:
      return {
        isFetching: true,
      };
    case paymentPlanConstants.GET_PAYMENT_PLANS_SUCCESS:
      return {
        isFetching: false,
        paymentPlans: action.payload
      };
    case paymentPlanConstants.GET_PAYMENT_PLANS_ERROR:
      return {
        isFetching: false,
        paymentPlans: []
      };
    default:
      return state
  }
}
