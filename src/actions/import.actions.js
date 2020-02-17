import { contentConstants } from '../constants';
import { importService } from '../services';
import { toast } from 'react-toastify';
import intl from 'react-intl-universal';

export const importActions = {
  importAssets
};

function importAssets(assets, albumId, modalCloseCallback, successCallback) {
    return dispatch => {
      
      dispatch(request());
      toast.info(intl.get("fileImportStart"));

      importService.importAssets(assets, albumId)
        .then(response => {
            response = response.filter(dto => dto.imported);
            const data = response.map(dto => {
            return dto.asset;
          });

          const responseObject = {
              assets: data
          }

          dispatch(success(responseObject));
          toast.success(intl.get('fileImportSuccess'));
          if(modalCloseCallback){
              modalCloseCallback();
          }

          if(successCallback){
              successCallback();
          }
        }).catch(error => {
          dispatch(failure(error));
          if(modalCloseCallback){
              modalCloseCallback();
          }
        });
  };

  function request() { return { type: contentConstants.UPLOAD_CONTENT_REQUEST } }
  function success(payload) { return { type: contentConstants.UPLOAD_CONTENT_SUCCESS, payload } }
  function failure(error) { return { type: contentConstants.UPLOAD_CONTENT_ERROR, error } }
}