import { sleepConstants } from "../constants/sleep.constants";
import { sleepServices } from "../services/sleep.services";

export const sleepActions = {
    getLast24HoursSleepReport,
    getSleepReport
};

function getLast24HoursSleepReport(payload) {
    return dispatch => {
        dispatch(request());

        sleepServices.getLast24HoursSleepReport(payload)
          .then(sleep => {
            dispatch(success(sleep));
          }).catch(error => {
            dispatch(failure(error));
          });
    };

    function request() { return { type: sleepConstants.GET_LAST_24_HOURS_SLEEP_REPORT_REQUEST} }
    function success(payload) { return { type: sleepConstants.GET_LAST_24_HOURS_SLEEP_REPORT_SUCCESS, payload } }
    function failure(error) { return { type: sleepConstants.GET_LAST_24_HOURS_SLEEP_REPORT_ERROR, error } }
}

function getSleepReport(payload) {
  return dispatch => {
      dispatch(request());

      sleepServices.getSleepReport(payload)
        .then(sleep => {
          dispatch(success(sleep));
        }).catch(error => {
          dispatch(failure(error));
        });
  };

  function request() { return { type: sleepConstants.GET_SLEEP_REPORT_REQUEST} }
  function success(payload) { return { type: sleepConstants.GET_SLEEP_REPORT_SUCCESS, payload } }
  function failure(error) { return { type: sleepConstants.GET_SLEEP_REPORT_ERROR, error } }
}