import { contentConstants } from '../constants';

const initialState = { isFetching: false, assets : [], contentUploadInProgress : false }

export function content(state = initialState, action) {
  switch (action.type) {
    case contentConstants.GET_CONTENT_REQUEST:
      return {
        isFetching: true,
        assets : [],
        contentUploadInProgress : false 
      };
    case contentConstants.GET_CONTENT_SUCCESS:
      return {
        isFetching: false,
        assets: action.payload,
      };
    case contentConstants.GET_CONTENT_ERROR:
      return {
        ...state,
        isFetching: false
      };
    case contentConstants.UPLOAD_CONTENT_REQUEST:
      return {
          ...state,
          contentUploadInProgress : true
        };
    case contentConstants.UPLOAD_CONTENT_SUCCESS:
      return {
        ...state,
        assets: [...state.assets, ...action.payload.assets],
        contentUploadInProgress: false
      };
    case contentConstants.UPLOAD_CONTENT_ERROR:
      return {
        ...state,
        contentUploadInProgress : false
        };
    case contentConstants.DELETE_CONTENT_REQUEST:
      return {...state};
    case contentConstants.DELETE_CONTENT_SUCCESS:
      return {
        ...state,
        assets: state.assets.filter(asset => { return !action.payload.includes(asset.id) })
      };
    case contentConstants.DELETE_CONTENT_ERROR:
      return {...state};
    case contentConstants.MOVE_CONTENT_TO_ALBUM_SUCCESS:
      return state
    default:
      return state
  }
}
