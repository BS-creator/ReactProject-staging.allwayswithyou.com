import { statsConstants } from "../constants/stats.constants";
import { statsServices } from "../services/stats.services";

export const statsActions = {
    get,
    getUploadersStats
};

function get(payload) {
    return dispatch => {
        dispatch(request());

        statsServices.get(payload)
          .then(stats => {
            dispatch(success(stats));
          }).catch(error => {
            dispatch(failure(error));
          });
    };

    function request() { return { type: statsConstants.GET_STATS_REQUEST} }
    function success(payload) { return { type: statsConstants.GET_STATS_SUCCESS, payload } }
    function failure(error) { return { type: statsConstants.GET_STATS_ERROR, error } }
}

function getUploadersStats(payload) {
  return dispatch => {
      dispatch(request());

      statsServices.getUploadersStats(payload)
        .then(stats => {
          dispatch(success(stats));
        }).catch(error => {
          dispatch(failure(error));
        });
  };

  function request() { return { type: statsConstants.GET_UPLOADERS_INFO_REQUEST} }
  function success(payload) { return { type: statsConstants.GET_UPLOADERS_INFO_SUCCESS, payload } }
  function failure(error) { return { type: statsConstants.GET_UPLOADERS_INFO_ERROR, error } }
}