import { albumConstants } from '../constants';
import { albumService } from '../services';
import ReactGA from 'react-ga';
import { toast } from 'react-toastify';
import { importActions } from './import.actions';
import intl from 'react-intl-universal';
import { history } from '../helpers';

export const albumActions = {
  createAlbum,
  remove,
  get,
  getAll,
  update,
  assetsUpload,
  addAssetsToAlbum,
  removeAssetsFromAlbum
};


function createAlbum(album, isImport, photos, closeModalCallback) {
  return dispatch => {
    dispatch(request());

    albumService.createAlbum(album)
      .then(album => {
        ReactGA.event({
          category: 'album',
          action: 'album create',
          label: album.id
        });

        dispatch(success(album));

        if (isImport) {
          dispatch(importActions.importAssets(photos, album.id, closeModalCallback));
          history.push('/albums');
        } 
        
        toast.success(intl.get("newAlbumCreated"));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: albumConstants.CREATE_ALBUM_REQUEST } }
  function success(payload) { return { type: albumConstants.CREATE_ALBUM_SUCCESS, payload } }
  function failure(error) { return { type: albumConstants.CREATE_ALBUM_ERROR, error } }
}

function remove(id) {
  return dispatch => {
    dispatch(request());

    albumService.remove(id)
      .then(() => {
        ReactGA.event({
          category: 'album',
          action: 'album removed'
        });

        dispatch(success(id));
        history.push('/albums');
        toast.success(intl.get("albumHasBeenRemoved"));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: albumConstants.DELETE_ALBUM_REQUEST } }
  function success(payload) { return { type: albumConstants.DELETE_ALBUM_SUCCESS, payload } }
  function failure(error) { return { type: albumConstants.DELETE_ALBUM_ERROR, error } }
}

function get(id) {
  return dispatch => {
    dispatch(request());

    albumService.get(id)
      .then(album => {
        dispatch(success(album));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: albumConstants.GET_ALBUM_REQUEST } }
  function success(payload) { return { type: albumConstants.GET_ALBUM_SUCCESS, payload } }
  function failure(error) { return { type: albumConstants.GET_ALBUM_ERROR, error } }
}

function getAll() {
  return dispatch => {
    dispatch(request());

    albumService.getAll()
      .then(album => {
        dispatch(success(album));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: albumConstants.GET_ALL_ALBUMS_REQUEST } }
  function success(payload) { return { type: albumConstants.GET_ALL_ALBUMS_SUCCESS, payload } }
  function failure(error) { return { type: albumConstants.GET_ALL_ALBUMS_ERROR, error } }
}

function update(albumId, albumUpdate) {
  return dispatch => {
    dispatch(request());

    albumService.update(albumId, albumUpdate)
      .then(album => {
        dispatch(success(album));
        toast.success(intl.get("albumUpdatedSuccess"));

        ReactGA.event({
          category: 'album update',
          action: 'album updated'
        });
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: albumConstants.UPDATE_ALBUM_REQUEST } }
  function success(payload) { return { type: albumConstants.UPDATE_ALBUM_SUCCESS, payload } }
  function failure(error) { return { type: albumConstants.UPDATE_ALBUM_ERROR, error } }
}

function assetsUpload(assets) {
  return dispatch => {
    dispatch(success(assets));

  };

  function success(payload) { return { type: albumConstants.ALBUM_ASSETS_UPLOAD, payload } }
}

function addAssetsToAlbum(albumId, assets) {
  const assetIds = assets.map(selectedAsset => selectedAsset.id);

  return dispatch => {
    dispatch(request());

    albumService.addAssets(albumId, assetIds)
      .then(() => {
        dispatch(success(assets));

        toast.success(intl.get("albumUpdatedSuccess"));

        ReactGA.event({
          category: 'album update',
          action: 'album updated'
        });
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: albumConstants.ADD_ASSETS_TO_ALBUM_REQUEST } }
  function success(payload) { return { type: albumConstants.ADD_ASSETS_TO_ALBUM_SUCCESS, payload } }
  function failure(error) { return { type: albumConstants.ADD_ASSETS_TO_ALBUM_ERROR, error } }
}

function removeAssetsFromAlbum(albumId, assets) {
  var assetIds = assets.map(selectedAsset => selectedAsset.assetId);
  return dispatch => {
    dispatch(request());

    albumService.removeAssets(albumId, assetIds)
      .then(() => {
        dispatch(success(assetIds));
        toast.success(intl.get("albumUpdatedSuccess"));

        ReactGA.event({
          category: 'album update',
          action: 'album updated'
        });
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: albumConstants.REMOVE_ASSETS_FROM_ALBUM_REQUEST } }
  function success(payload) { return { type: albumConstants.REMOVE_ASSETS_FROM_ALBUM_SUCCESS, payload } }
  function failure(error) { return { type: albumConstants.REMOVE_ASSETS_FROM_ALBUM_ERROR, error } }
}