import { paymentPlanConstants } from '../constants';
import { paymentPlanService } from '../services';

export const paymentPlanActions = {
  getPaymentPlans
};

function getPaymentPlans() {
    return dispatch => {
      dispatch(request());

      paymentPlanService.getPaymentPlans()
        .then(account => {
          dispatch(success(account));
        }).catch(error => {
          dispatch(failure(error));
        });
  };

  function request() { return { type: paymentPlanConstants.GET_PAYMENT_PLANS_REQUEST} }
  function success(payload) { return { type: paymentPlanConstants.GET_PAYMENT_PLANS_SUCCESS, payload } }
  function failure(error) { return { type: paymentPlanConstants.GET_PAYMENT_PLANS_ERROR, error } }
}